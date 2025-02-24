import { decodeToken } from "./jwt"; // Asegúrate de que la ruta sea correcta
import { CustomError } from "../errors/custom-error";
import { Role } from "../enums/role.enum";
import { prisma } from "./prisma";

export const authenticate = async (
  request: Request,
  requiredRole: Role,
): Promise<string> => {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];
    const payload = decodeToken(token);
    if (payload.exp < Date.now() / 1000) {
      throw new CustomError({
        message: "Token expirado.",
        statusCode: 401,
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        sub: payload.sub,
      },
    });
    if (!user || user.role !== requiredRole) {
      throw new CustomError({
        message: "No tienes permiso para acceder a este recurso.",
        statusCode: 403,
      });
    }
    return user.id;
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new CustomError({
      message: "Token inválido o expirado.",
      statusCode: 401,
    });
  }
};
