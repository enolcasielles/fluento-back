"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient().$extends({
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
exports.default = prisma;
//# sourceMappingURL=index.js.map