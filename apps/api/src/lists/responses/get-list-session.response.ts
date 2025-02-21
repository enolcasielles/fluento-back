export class QuestionResponse {
  text: string;
  audio: string;
}

export class UnitResponse {
  id: string;
  question: QuestionResponse;
  answer: QuestionResponse;
  responseTime: number;
}

export class GetListSessionResponse {
  sessionId: string;
  listId: string;
  listName: string;
  evaluationMode: 'auto' | 'manual';
  nextUnit: UnitResponse;
} 