/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export class CreateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;
  dob: string;
}