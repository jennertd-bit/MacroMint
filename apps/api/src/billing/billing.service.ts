import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../database/prisma.service";
import Stripe from "stripe";

@Injectable()
export class BillingService {
  private readonly stripe: Stripe;

  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {
    const key = this.config.get<string>("STRIPE_SECRET_KEY") || "";
    this.stripe = new Stripe(key, { apiVersion: "2023-10-16" });
  }

  private async getOrCreateCustomer(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.stripeCustomerId) return user.stripeCustomerId;

    const customer = await this.stripe.customers.create({ email });
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id }
    });
    return customer.id;
  }

  async createCheckout(userId: string, email: string) {
    const priceId = this.config.get<string>("STRIPE_PRICE_ID_PRO");
    if (!priceId) throw new Error("STRIPE_PRICE_ID_PRO missing");

    const customerId = await this.getOrCreateCustomer(userId, email);
    const successUrl = this.config.get<string>("STRIPE_SUCCESS_URL") || "";
    const cancelUrl = this.config.get<string>("STRIPE_CANCEL_URL") || "";
    const trialDays = Number(this.config.get<string>("STRIPE_TRIAL_DAYS") || "3");

    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: trialDays > 0 ? { trial_period_days: trialDays } : undefined,
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    return { url: session.url };
  }

  async createPortal(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.stripeCustomerId) throw new Error("Customer not found");

    const returnUrl = this.config.get<string>("STRIPE_SUCCESS_URL") || "";
    const session = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl
    });

    return { url: session.url };
  }

  verifyWebhookSignature(rawBody: Buffer | string, signature: string): Stripe.Event {
    const secret = this.config.get<string>("STRIPE_WEBHOOK_SECRET");
    if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    return this.stripe.webhooks.constructEvent(rawBody, signature, secret);
  }

  async handleWebhook(payload: any) {
    const type = payload.type;
    if (!type) return { received: true };

    if (type.startsWith("customer.subscription")) {
      const subscription = payload.data.object as Stripe.Subscription;
      const user = await this.prisma.user.findFirst({
        where: { stripeCustomerId: subscription.customer as string }
      });
      if (!user) return { received: true };

      const statusMap: Record<string, string> = {
        active: "ACTIVE",
        trialing: "TRIALING",
        past_due: "PAST_DUE",
        canceled: "CANCELED",
        incomplete: "INCOMPLETE",
        incomplete_expired: "INCOMPLETE"
      };
      const status = statusMap[subscription.status] ?? "INCOMPLETE";

      const existing = await this.prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id }
      });

      if (existing) {
        await this.prisma.subscription.update({
          where: { id: existing.id },
          data: {
            status: status as any,
            priceId: subscription.items.data[0]?.price.id,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });
      } else {
        await this.prisma.subscription.create({
          data: {
            userId: user.id,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            priceId: subscription.items.data[0]?.price.id,
            status: status as any,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });
      }
    }

    return { received: true };
  }

  async getStatus(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    if (!subscription) {
      return { pro: false, status: "NONE", currentPeriodEnd: null };
    }

    const now = new Date();
    const activeStatuses = ["ACTIVE", "TRIALING"];
    const isActive = activeStatuses.includes(subscription.status) &&
      (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > now);

    return {
      pro: isActive,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd
    };
  }

  async requirePro(userId: string) {
    const status = await this.getStatus(userId);
    if (!status.pro) {
      throw new ForbiddenException("Pro subscription required");
    }
    return status;
  }
}
