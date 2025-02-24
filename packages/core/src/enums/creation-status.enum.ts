export enum CreationStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export const CreationStatusLabels = {
  [CreationStatus.PENDING]: "Pendiente",
  [CreationStatus.IN_PROGRESS]: "En progreso",
  [CreationStatus.COMPLETED]: "Completado",
  [CreationStatus.FAILED]: "Fallido",
};
