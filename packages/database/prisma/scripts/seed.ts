import { PrismaClient, Difficulty, CreationStatus } from "@prisma/client";
import { config } from "dotenv";

// Cargar variables de entorno desde .env
config();

console.log(process.env.DB_URL);

// Verificar que las variables necesarias estén definidas
if (!process.env.DB_URL) {
  throw new Error("DB_URL no está definida en las variables de entorno");
}

const prisma = new PrismaClient();

async function main() {
  // Limpiar la base de datos
  await prisma.result.deleteMany();
  await prisma.session.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.list.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de ejemplo
  const user1 = await prisma.user.create({
    data: {
      sub: "1234567890",
      email: "usuario1@ejemplo.com",
      name: "Usuario Ejemplo 1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      sub: "1234567891",
      email: "usuario2@ejemplo.com",
      name: "Usuario Ejemplo 2",
    },
  });

  // Crear categorías
  const categorias = await Promise.all([
    prisma.category.create({
      data: { name: "Conversación Diaria" },
    }),
    prisma.category.create({
      data: { name: "Negocios" },
    }),
    prisma.category.create({
      data: { name: "Viajes" },
    }),
  ]);

  // Crear listas de ejemplo
  const lista1 = await prisma.list.create({
    data: {
      name: "Saludos y Presentaciones",
      description: "Aprende frases básicas para presentarte",
      imageUrl: "https://ejemplo.com/imagen1.jpg",
      difficulty: Difficulty.BEGINNER,
      topic: "Conversación",
      grammarStructures: "Presente simple, Ser/Estar",
      totalUnits: 2,
      creationStatus: CreationStatus.COMPLETED,
      isPublic: true,
      categoryId: categorias[0].id,
      creatorId: user1.id,
      units: {
        create: [
          {
            questionText: "¿Cómo te llamas?",
            questionAudio: "url-audio-1",
            answerText: "Me llamo Juan",
            answerAudio: "url-audio-2",
            responseTime: 5000,
          },
          {
            questionText: "¿De dónde eres?",
            questionAudio: "url-audio-3",
            answerText: "Soy de España",
            answerAudio: "url-audio-4",
            responseTime: 5000,
          },
        ],
      },
    },
  });

  // Crear una sesión de ejemplo con resultados
  await prisma.session.create({
    data: {
      userId: user2.id,
      listId: lista1.id,
      results: {
        create: [
          {
            score: 3,
            unitId: (await prisma.unit.findFirst({
              where: { listId: lista1.id },
            }))!.id,
            userId: user2.id,
            answer: "NO_ANSWER",
          },
        ],
      },
    },
  });

  // Guardar una lista para un usuario
  await prisma.user.update({
    where: { id: user2.id },
    data: {
      savedLists: {
        connect: { id: lista1.id },
      },
    },
  });

  console.log("Base de datos poblada con éxito");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
