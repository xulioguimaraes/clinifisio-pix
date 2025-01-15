import { PrismaClient } from "@prisma/client";

// Defina uma variável global para reutilizar a instância em ambientes de desenvolvimento
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (
  process.env.NODE_ENV === "production" ||
  !process.env.DATABASE_URL?.includes("localhost")
) {
  // Cria uma instância do Prisma Client somente se estiver em produção ou em um banco remoto
  prisma = new PrismaClient({
    log: ["query"], // Opcional, para logar as queries executadas
  });
} else {
  // Em desenvolvimento, usamos a instância global para garantir que o Prisma não seja recriado em cada requisição
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query"],
    });
  }
  prisma = global.prisma;
}

export { prisma };
