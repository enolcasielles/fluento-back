
interface Result {
  createdAt: Date;
  score: number;
}

interface Unit {
  id: string;
  questionText: string;
  questionAudio: string;
  answerText: string;
  answerAudio: string;
  results: Array<Result>;
  responseTime: number;
}

interface Props {
  units: Array<Unit>;
}

export async function generateNextUnit(props: Props): Promise<Unit> {
  const { units } = props;
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