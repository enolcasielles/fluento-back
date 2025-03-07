import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  name: "findManyAndCount",
  model: {
    $allModels: {
      findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">>,
      ): Promise<[Prisma.Result<Model, Args, "findMany">, number]> {
        return prisma.$transaction([
          (this as any).findMany(args),
          (this as any).count({ where: (args as any).where }),
        ]) as any;
      },
    },
  },
});

export default prisma;

export type { PrismaClient };
export * from "./types";
