import { CustomError } from "../errors";
import { openai } from "../lib/openai";

export async function evaluateAnswer(
  userResponse: string,
  answerText: string,
): Promise<number> {
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

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 5,
    });

    const score = parseInt(
      completion.choices[0].message.content?.trim() ?? "0",
    );

    if (score >= 1 && score <= 3) {
      return score;
    }

    throw new CustomError({
      message: "La evaluación no produjo un resultado válido",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError({
      message: "Error al evaluar la respuesta",
    });
  }
}
