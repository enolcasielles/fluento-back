import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
};
