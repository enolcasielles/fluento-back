export class UnitResponse {
  id: string;
  question: {
    text: string;
    audio: string;
  };
  answer: {
    text: string;
    audio: string;
  };
  responseTime: number;
}

export class SubmitResultResponse {
  nextUnit: UnitResponse;
} 