import { Global, Module } from "@nestjs/common";
import { getSupabaseClient } from "../lib/supabase";
import prisma from "@repo/database";

export const SUPABASE_PROVIDER = "SUPABASE_PROVIDER";
export const PRISMA_PROVIDER = "PRISMA_PROVIDER";

@Global()
@Module({
  providers: [
    {
      provide: SUPABASE_PROVIDER,
      useFactory: () => {
        return getSupabaseClient()
      }
    },
    {
      provide: PRISMA_PROVIDER,
      useFactory: () => {
        return prisma
      }
    }
  ],
  exports: [SUPABASE_PROVIDER, PRISMA_PROVIDER]
})
export class CoreModule {}