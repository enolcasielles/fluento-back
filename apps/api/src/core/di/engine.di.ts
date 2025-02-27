import { audioToText, calculateResponseTime, evaluateAnswer, generateListImage, generateNextUnit, listGenerator, textToAudio } from '@repo/core';

export interface IEngineDI {
  generateNextUnit: typeof generateNextUnit;
  audioToText: typeof audioToText;
  textToAudio: typeof textToAudio;
  evaluateAnswer: typeof evaluateAnswer;
  calculateResponseTime: typeof calculateResponseTime;
  generateListImage: typeof generateListImage;
  listGenerator: typeof listGenerator;
}

export const EngineDI: IEngineDI = {
  generateNextUnit,
  audioToText,
  textToAudio,
  evaluateAnswer,
  calculateResponseTime,
  generateListImage,
  listGenerator,
}