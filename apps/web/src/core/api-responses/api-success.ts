import { successResponse } from "../responses/basic.response";

export const apiSuccess = (data?: any) => {
  return new Response(JSON.stringify(data ?? successResponse()), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
