import { BadRequestException, Body, Controller, Get, Headers, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { BillingService } from "./billing.service";

@Controller("billing")
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @UseGuards(JwtAuthGuard)
  @Post("checkout")
  checkout(@Req() req: any) {
    return this.billing.createCheckout(req.user.userId, req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Post("portal")
  portal(@Req() req: any) {
    return this.billing.createPortal(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("status")
  status(@Req() req: any) {
    return this.billing.getStatus(req.user.userId);
  }

  @Post("webhook")
  webhook(@Req() req: any, @Body() body: any, @Headers("stripe-signature") signature?: string) {
    if (!signature) throw new BadRequestException("Missing stripe-signature header");
    const rawBody: Buffer = (req.raw ?? req).rawBody;
    let event: any;
    try {
      event = this.billing.verifyWebhookSignature(rawBody ?? JSON.stringify(body), signature);
    } catch (err: any) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }
    return this.billing.handleWebhook(event);
  }
}
