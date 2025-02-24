import { CustomError } from "../errors";
import { openai } from "../lib/openai";

interface TextToSpeechProps {
  text: string;
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  model?: "tts-1" | "tts-1-hd";
}

export async function textToAudio({
  text,
  voice = "nova",
  model = "tts-1",
}: TextToSpeechProps): Promise<Buffer> {
  try {
    const mp3Response = await openai.audio.speech.create({
      model: model,
      voice: voice,
      input: text,
    });

    // Convertir la respuesta a un Buffer
    const buffer = Buffer.from(await mp3Response.arrayBuffer());

    if (!buffer) {
      throw new CustomError({
        message: "No se pudo generar el audio",
      });
    }

    return buffer;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError({
      message: "Error al generar el audio",
    });
  }
}
