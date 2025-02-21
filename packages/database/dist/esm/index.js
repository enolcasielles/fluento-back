import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient().$extends({
    name: "findManyAndCount",
    model: {
        $allModels: {
            findManyAndCount(args) {
                return prisma.$transaction([
                    this.findMany(args),
                    this.count({ where: args.where }),
                ]);
            },
        },
    },
});
export default prisma;
//# sourceMappingURL=index.js.map