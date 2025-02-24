import { KafkaConsumer } from "@repo/kafka";
import { calculateResponseTime, CreateListMessage, CreationStatus, Difficulty, generateListImage, listGenerator, Topics } from "@repo/core";
import prisma from "@repo/database";

export class CreateListConsumer extends KafkaConsumer<CreateListMessage> {
  topic = Topics.CREATE_LIST;
  groupId = 'createListConsumer';

  async onMessage(message: CreateListMessage): Promise<boolean> {
    try {
      console.log('Processing message', message);
      const { listId, userId } = message;
      const list = await prisma.list.findUnique({
        where: { id: listId, creatorId: userId },
        include: {
          units: true,
        },
      });

      if (!list) {
        return true;
      }

      if (list.units.length > 0) {
        return true;
      }

      if (list.creationStatus !== CreationStatus.PENDING) {
        return true;
      }

      await prisma.list.update({
        where: { id: listId },
        data: {
          creationStatus: CreationStatus.IN_PROGRESS,
        },
      });

      if (!list.imageUrl) {
        try {
          const imageUrl = await generateListImage({
            topic: list.topic,
          });
          await prisma.list.update({
            where: { id: listId },
            data: {
              imageUrl,
            },
          });
        } catch (error) {}
      }

      try {
        const { units, description } = await listGenerator({
          difficulty: list.difficulty as Difficulty,
          topic: list.topic,
          grammarStructures: list.grammarStructures,
          numberOfUnits: 10,
        });

        const unitsToCreate: Array<{
          questionText: string;
          questionAudio: string;
          answerText: string;
          answerAudio: string;
        }> = [];

        for (const unit of units) {
          unitsToCreate.push({
            questionText: unit.questionText,
            questionAudio: null,
            answerText: unit.answerText,
            answerAudio: null,
          });
        }

        await prisma.unit.createMany({
          data: unitsToCreate.map((unit) => ({
            ...unit,
            listId,
            responseTime: calculateResponseTime({
              answerText: unit.answerText,
              difficulty: list.difficulty as Difficulty,
            }),
          })),
        });

        await prisma.list.update({
          where: { id: listId },
          data: {
            creationStatus: CreationStatus.COMPLETED,
            description,
            totalUnits: unitsToCreate.length,
          },
        });
      } catch (error) {
        await prisma.list.update({
          where: { id: listId },
          data: {
            creationStatus: CreationStatus.FAILED,
          },
        });
      }
    } catch (error) {
      // TODO: Insertar a una cola de errores.
    }
    return true;
  }
}