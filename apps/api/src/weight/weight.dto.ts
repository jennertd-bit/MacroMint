import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class LogWeightDto {
  @IsDateString()
  date: string;

  @IsNumber()
  @Min(20)
  @Max(500)
  weightKg: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class GetWeightHistoryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
