import { CustomError } from "../errors";
import { openai } from "../lib/openai";
import { getRandomImage } from "../lib/unsplash";

interface Props {
  topic?: string;
}

export async function generateListImage(props: Props): Promise<string> {
  try {
    const { topic = "General English" } = props;

    const prompt = `
      Eres un asistente creativo que ayuda a generar términos de búsqueda para encontrar imágenes relacionadas con una temática específica. A continuación, te proporciono una temática y necesito que me des 5 términos de búsqueda que sean relevantes, descriptivos y visualmente atractivos. Los términos deben ser adecuados para buscar imágenes en Unsplash. 

      Temática: ${topic}

      Por favor, devuélveme únicamente los 5 términos de búsqueda. Responde en formato JSON con este esquema:
      {
        "queries": ["query1", "query2", "query3", "query4", "query5"]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini-2024-07-18",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new CustomError({
        message: "No se pudieron generar las queries",
      });
    }

    const parsedResponse = JSON.parse(response);

    const imageUrl = await getRandomImage([
      ...parsedResponse.queries,
      "General English",
    ]);

    return imageUrl;
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError({
      message: "Error al generar las queries",
    });
  }
}
