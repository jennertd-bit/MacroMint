import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../database/prisma.service";
import { QueueService } from "../queue/queue.service";
import { CreateScanDto } from "./scans.dto";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class ScansService {
  private readonly s3: S3Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: QueueService,
    private readonly config: ConfigService
  ) {
    this.s3 = new S3Client({
      region: this.config.get<string>("AWS_REGION") || "us-east-1"
    });
  }

  private buildPublicUrl(key: string) {
    const bucket = this.config.get<string>("S3_BUCKET");
    const base = this.config.get<string>("S3_PUBLIC_BASE_URL");
    const region = this.config.get<string>("AWS_REGION") || "us-east-1";
    if (base) return `${base.replace(/\/$/, "")}/${key}`;
    if (!bucket) return key;
    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  async createScan(userId: string, dto: CreateScanDto) {
    const bucket = this.config.get<string>("S3_BUCKET");
    if (!bucket) throw new BadRequestException("S3_BUCKET not configured");

    const key = `scans/${userId}/${randomUUID()}-${dto.fileName}`;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: dto.contentType || "image/jpeg"
    });

    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 900 });
    const imageUrl = this.buildPublicUrl(key);

    const scan = await this.prisma.scan.create({
      data: {
        userId,
        imageUrl
      }
    });

    return { scanId: scan.id, uploadUrl, imageUrl };
  }

  async processScan(userId: string, scanId: string) {
    const scan = await this.prisma.scan.findFirst({ where: { id: scanId, userId } });
    if (!scan) throw new NotFoundException("Scan not found");

    const job = await this.queue.enqueueScan(scanId);
    if (!job) {
      return { status: "unavailable", message: "Scan queue is not configured" };
    }
    return { status: "queued" };
  }

  async getScan(userId: string, scanId: string) {
    const scan = await this.prisma.scan.findFirst({
      where: { id: scanId, userId },
      include: { links: { include: { food: true } } }
    });
    if (!scan) throw new NotFoundException("Scan not found");
    return scan;
  }
}
