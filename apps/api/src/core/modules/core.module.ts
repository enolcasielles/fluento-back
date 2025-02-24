import { Global, Module } from "@nestjs/common";
import { openai, supabase } from "@repo/core";
import prisma from "@repo/database";
import { EngineService } from "../services/engine.service";
import { UnsplashService } from "../services/unsplash.service";

export const SUPABASE_PROVIDER = "SUPABASE_PROVIDER";
export const PRISMA_PROVIDER = "PRISMA_PROVIDER";
export const OPENAI_PROVIDER = "OPENAI_PROVIDER";

@Global()
@Module({
  providers: [
    {
      provide: OPENAI_PROVIDER,
      useFactory: () => {
        return openai;
      }
    },
    {
      provide: PRISMA_PROVIDER,
      useValue: prisma
    },
    {
      provide: SUPABASE_PROVIDER,
      useValue: supabase
    },
    UnsplashService,
    {
      provide: EngineService,
      useFactory: (openai, prismaClient, unsplash) => {
        return new EngineService(openai, prismaClient, unsplash);
      },
      inject: [OPENAI_PROVIDER, PRISMA_PROVIDER, UnsplashService]
    }
  ],
  exports: [
    SUPABASE_PROVIDER, 
    PRISMA_PROVIDER, 
    OPENAI_PROVIDER, 
    EngineService, 
    UnsplashService
  ]
})
export class CoreModule {}