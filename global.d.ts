/* eslint-disable no-unused-vars */
import { PrismaClient } from "@prisma/client";

// Estendendo a interface do global para incluir a propriedade prisma
declare global {
    var prisma: PrismaClient | undefined;
}

export { };
