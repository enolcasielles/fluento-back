import { Inject, Injectable } from "@nestjs/common";
import { CustomException } from "@/core/exceptions/custom.exception";
import { PrismaClient } from "@repo/database";
import { SupabaseClient } from "@supabase/supabase-js";
import { PRISMA_PROVIDER, SUPABASE_PROVIDER } from "@/core/modules/core.module";

enum LoginError {
  EMAIL_NOT_CONFIRMED = "email_not_confirmed",
  INVALID_CREDENTIALS = "invalid_credentials",
}

@Injectable()
export class AuthService {

  constructor(
    @Inject(SUPABASE_PROVIDER) private supabase: SupabaseClient,
    @Inject(PRISMA_PROVIDER) private prisma: PrismaClient,
  ) {}

  async login(
    email: string,
    password: string,
  ) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      if (error.code === LoginError.EMAIL_NOT_CONFIRMED) {
        throw new CustomException({
          message: "El correo electrónico no ha sido confirmado",
          statusCode: 400,
        });
      }
      if (error.code === LoginError.INVALID_CREDENTIALS) {
        throw new CustomException({
          message: "Credenciales inválidas",
          statusCode: 400,
        });
      }
      throw new CustomException({
        message: "Error al iniciar sesión",
        statusCode: 401,
      });
    }
    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }

  async register(
    email: string,
    name: string,
    password: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new CustomException({
        message: "El usuario ya existe",
        statusCode: 400,
      });
    }
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw new CustomException({
        message: "Error al crear el usuario",
        statusCode: 400,
      });
    }
    await this.prisma.user.create({
      data: {
        email: email,
        name: name,
        role: "USER",
        sub: data.user.id,
      },
    });
  }

}

