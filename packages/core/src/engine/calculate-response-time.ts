import { Difficulty } from "../enums/difficulty.enum";

interface Props {
  answerText: string;
  difficulty: Difficulty;
}

export function calculateResponseTime({
  answerText,
  difficulty,
}: Props): number {
  // Base: 150ms por carácter
  const baseTimePerChar = 150;

  // Tiempo base según la longitud
  const baseTime = answerText.length * baseTimePerChar;

  // Factor de dificultad
  const difficultyFactor = {
    [Difficulty.BEGINNER]: 1.3, // 30% más de tiempo
    [Difficulty.INTERMEDIATE]: 1.1, // 10% más de tiempo
    [Difficulty.ADVANCED]: 1, // tiempo base
    [Difficulty.ANY]: 1, // tiempo base
  };

  // Ajuste por palabras (las palabras cortas son más rápidas de decir)
  const words = answerText.split(" ");
  const averageWordLength =
    words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const wordLengthFactor = averageWordLength > 6 ? 1.2 : 1;

  // Tiempo final en milisegundos
  const finalTime = Math.round(
    baseTime * difficultyFactor[difficulty] * wordLengthFactor,
  );

  // Establecemos límites mínimos y máximos
  const minTime = 3000; // mínimo 3 segundos
  const maxTime = 15000; // máximo 15 segundos

  return Math.min(Math.max(finalTime, minTime), maxTime);
}
