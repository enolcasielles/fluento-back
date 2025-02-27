import { Global, Module } from "@nestjs/common";
import { openai, supabase } from "@repo/core";
import prisma from "@repo/database";
import { EngineDI } from "../di/engine.di";

export const SUPABASE_PROVIDER = "SUPABASE_PROVIDER";
export const PRISMA_PROVIDER = "PRISMA_PROVIDER";
export const OPENAI_PROVIDER = "OPENAI_PROVIDER";
export const ENGINE_PROVIDER = "ENGINE_DI_PROVIDER";

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
    {
      provide: ENGINE_PROVIDER,
      useValue: EngineDI
    }
  ],
  exports: [
    SUPABASE_PROVIDER, 
    PRISMA_PROVIDER, 
    OPENAI_PROVIDER,
    ENGINE_PROVIDER
  ]
})
export class CoreModule {}