import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Difficulty } from '../enums/difficulty.enum';
import { CustomException } from '../exceptions/custom.exception';
import { PrismaClient, Result, Unit } from '@repo/database';
import { OPENAI_PROVIDER, PRISMA_PROVIDER } from '../modules/core.module';
import { OpenAI } from 'openai';
import { UnsplashService } from './unsplash.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class EngineService implements OnModuleInit {
  constructor(
    @Inject(OPENAI_PROVIDER) private readonly openai: OpenAI,
    @Inject(PRISMA_PROVIDER) private readonly prisma: PrismaClient,
    private readonly unsplashService: UnsplashService,
  ) {
    // Validación inmediata de las dependencias
    if (!this.openai) throw new Error('OpenAI client not initialized');
    if (!this.prisma) throw new Error('Prisma client not initialized');
  }

  async onModuleInit() {
    // Verificar que las dependencias se inyecten correctamente
    if (!this.openai || !this.prisma) {
      throw new Error('Required dependencies not initialized');
    }
  }

  async audioToText(audio: File): Promise<string> {
    try {
      const arrayBuffer = await audio.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const transcription = await this.openai.audio.transcriptions.create({
        file: new File([buffer], audio.name, { type: audio.type }),
        model: 'whisper-1',
        language: 'en',
        response_format: 'text',
      });

      if (!transcription) {
        throw new CustomException({
          message: 'No se pudo transcribir el audio',
        });
      }

      return transcription;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException({
        message: 'Error al procesar el audio',
      });
    }
  }

  calculateResponseTime(props: { answerText: string; difficulty: Difficulty }): number {
    const { answerText, difficulty } = props;
    const baseTimePerChar = 150;
    const baseTime = answerText.length * baseTimePerChar;

    const difficultyFactor = {
      [Difficulty.BEGINNER]: 1.3,
      [Difficulty.INTERMEDIATE]: 1.1,
      [Difficulty.ADVANCED]: 1,
      [Difficulty.ANY]: 1,
    };

    const words = answerText.split(' ');
    const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const wordLengthFactor = averageWordLength > 6 ? 1.2 : 1;

    const finalTime = Math.round(
      baseTime * difficultyFactor[difficulty] * wordLengthFactor,
    );

    const minTime = 3000;
    const maxTime = 15000;

    return Math.min(Math.max(finalTime, minTime), maxTime);
  }

  async evaluateAnswer(userResponse: string, answerText: string): Promise<number> {
    try {
      const prompt = `
      Eres un profesor de idiomas experto. El alumno debe traducir una frase del español al inglés. Tu objetivo es evaluar dicha respuesta, usando el siguiente criterio: 
      
      1 = Incorrecta (significado muy diferente o respuesta incomprensible)
      2 = Parcialmente correcta (tiene errores pero mantiene parte del significado)
      3 = Correcta (igual significado, pueden existir pequeñas variaciones)
      
      Responde únicamente con el número de la evaluación (1, 2, 3).

      --------------------

      Respuesta esperada: "${answerText}"
      Respuesta del usuario: "${userResponse}"
      `;

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 5,
      });

      const score = parseInt(completion.choices[0].message.content?.trim() ?? '0');

      if (score >= 1 && score <= 3) {
        return score;
      }

      throw new CustomException({
        message: 'La evaluación no produjo un resultado válido',
      });
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException({
        message: 'Error al evaluar la respuesta',
      });
    }
  }

  async generateListImage(props: { topic?: string }): Promise<string> {
    try {
      const { topic = 'General English' } = props;

      const prompt = `
        Eres un asistente creativo que ayuda a generar términos de búsqueda para encontrar imágenes relacionadas con una temática específica. A continuación, te proporciono una temática y necesito que me des 5 términos de búsqueda que sean relevantes, descriptivos y visualmente atractivos. Los términos deben ser adecuados para buscar imágenes en Unsplash. 

        Temática: ${topic}

        Por favor, devuélveme únicamente los 5 términos de búsqueda. Responde en formato JSON con este esquema:
        {
          "queries": ["query1", "query2", "query3", "query4", "query5"]
        }
      `;

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini-2024-07-18',
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new CustomException({
          message: 'No se pudieron generar las queries',
        });
      }

      const parsedResponse = JSON.parse(response);
      const imageUrl = await this.unsplashService.getRandomImage([...parsedResponse.queries, 'General English']);

      return imageUrl;
    } catch (error) {
      console.error(error);
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException({
        message: 'Error al generar las queries',
      });
    }
  }

  async generateNextUnit(sessionId: string): Promise<Unit> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        list: {
          include: {
            units: {
              include: {
                results: {
                  orderBy: {
                    createdAt: 'desc',
                  },
                },
              },
            },
          },
        },
      },
    });

    const units = session.list.units;
    const currentTime = new Date().getTime();
    const maxTimeDifference = units
      .filter((unit) => unit.results.length > 0)
      .map((unit) => currentTime - unit.results[0].createdAt.getTime())
      .sort((a, b) => b - a)[0];

    const scoredUnits = units.map((unit) => {
      const practiceResults: Result[] = unit.results;

      const score =
        practiceResults.length === 0
          ? 1
          : practiceResults.reduce((prev, elem) => prev + elem.score, 0) /
            practiceResults.length;
      const timesPracticed = practiceResults.length;
      const lastPracticedTime =
        practiceResults.length === 0
          ? currentTime - maxTimeDifference
          : new Date(practiceResults[0].createdAt).getTime();

      const timeSinceLastPracticed = currentTime - lastPracticedTime;

      const finalScore =
        0.4 * (1 / score) +
        0.3 * (timeSinceLastPracticed / maxTimeDifference) +
        0.2 * (1 / (timesPracticed + 1)) +
        0.1 * Math.random();

      return {
        unitId: unit.id,
        finalScore,
      };
    });

    const highestScoreUnit = scoredUnits.reduce((prev, current) => {
      return prev.finalScore > current.finalScore ? prev : current;
    }, scoredUnits[0]);

    return units.find((unit) => unit.id === highestScoreUnit.unitId);
  }

  async generateList(props: {
    difficulty: Difficulty;
    topic?: string;
    grammarStructures?: string;
    numberOfUnits?: number;
  }): Promise<{
    units: Array<{ questionText: string; answerText: string }>;
    description: string;
  }> {
    try {
      const {
        difficulty,
        topic = 'Temática general',
        grammarStructures = 'Cualquier estructura gramatical',
        numberOfUnits = 10,
      } = props;

      const prompt = `
      Actúa como un profesor de inglés experto. Tu objetivo es generar una lista de frasses que permitan al usuario practicar inglés utilizando la metodología de traducción de Español a Inglés. La lista debe contener exaxtamente ${numberOfUnits} pares de frases.
      
      Debes generar las frases cumpliendo los siguientes requisitos:
      - Nivel de dificultad: ${difficulty}. Posibles niveles: ${Object.values(Difficulty).join(', ')}
      - Temática a utilizar en las frases: ${topic}
      - Estructuras gramaticales a practicar: ${grammarStructures}
      
      Para cada par, necesito:
      1. Una frase en español (questionText)
      2. Su traducción correcta al inglés (answerText)
      
      Las frases deben:
      - Ser naturales y de uso común
      - Tener una longitud apropiada para el nivel
      - Enfocarse en el tema especificado
      - Utilizar las estructuras gramaticales indicadas

      Por último, debes generar una descripción que represente esta lista de frases.

      La descripción debe ser:
      - Una frase breve, de entre 10 y 20 palabras, que resuma el contenido de la lista de frases.
      - Que tenga un tono gracioso, amigable y entretenido.
      
      Responde en formato JSON con este esquema:
      {
        "units": [
          {
            "questionText": "Frase en español",
            "answerText": "Correct English translation"
          }
        ],
        "description": "Descripción de la lista de frases"
      }
      `;

      const completion = await this.openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4o-mini-2024-07-18',
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new CustomException({
          message: 'No se pudieron generar las unidades',
        });
      }

      const parsedResponse = JSON.parse(response);
      if (!parsedResponse.units || !Array.isArray(parsedResponse.units)) {
        throw new CustomException({
          message: 'El formato de respuesta no es válido',
        });
      }

      return parsedResponse;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException({
        message: 'Error al generar las unidades',
      });
    }
  }

  async textToAudio(props: {
    text: string;
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
    model?: 'tts-1' | 'tts-1-hd';
  }): Promise<Buffer> {
    try {
      const { text, voice = 'nova', model = 'tts-1' } = props;

      const mp3Response = await this.openai.audio.speech.create({
        model: model,
        voice: voice,
        input: text,
      });

      const buffer = Buffer.from(await mp3Response.arrayBuffer());

      if (!buffer) {
        throw new CustomException({
          message: 'No se pudo generar el audio',
        });
      }

      return buffer;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new CustomException({
        message: 'Error al generar el audio',
      });
    }
  }
} 