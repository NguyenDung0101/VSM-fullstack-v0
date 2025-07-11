import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
} from "class-validator";
import { Role } from "@prisma/client";

export class CreateUserDto {
  @ApiProperty({
    example: "Nguyễn Văn A",
    description: "Full name of the user",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "user@vsm.org.vn",
    description: "User email address",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: "hashedpassword",
    description: "User password (hashed)",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: "https://randomuser.me/api/portraits/men/3.jpg",
    description: "User avatar URL",
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    enum: Role,
    example: Role.USER,
    description: "User role",
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({
    example: true,
    description: "Whether the user is active",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
