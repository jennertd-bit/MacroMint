import { IsOptional, IsString } from "class-validator";

export class CreateScanDto {
  @IsString()
  fileName!: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}
