"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreationStatusLabels = exports.CreationStatus = void 0;
var CreationStatus;
(function (CreationStatus) {
    CreationStatus["PENDING"] = "PENDING";
    CreationStatus["IN_PROGRESS"] = "IN_PROGRESS";
    CreationStatus["COMPLETED"] = "COMPLETED";
    CreationStatus["FAILED"] = "FAILED";
})(CreationStatus || (exports.CreationStatus = CreationStatus = {}));
exports.CreationStatusLabels = {
    [CreationStatus.PENDING]: "Pendiente",
    [CreationStatus.IN_PROGRESS]: "En progreso",
    [CreationStatus.COMPLETED]: "Completado",
    [CreationStatus.FAILED]: "Fallido",
};
//# sourceMappingURL=creation-status.enum.js.map