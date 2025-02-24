import { createApi } from "unsplash-js";
import { CustomError } from "../errors";

if (!process.env.UNSPLASH_ACCESS_KEY) {
  throw new Error(
    "UNSPLASH_ACCESS_KEY no está definida en las variables de entorno",
  );
}

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export async function getRandomImage(queries: string[]): Promise<string> {
  let index = 0;
  while (index < queries.length) {
    try {
      const result = await unsplash.photos.getRandom({
        query: `${queries[index]}`,
        orientation: "landscape",
      });

      if (result.type === "error") {
        throw result.errors[0];
      }

      const random: any = result.response;
      return random.urls.small;
    } catch (err) {
      console.error("Error al obtener imagen de Unsplash:", err);
      index++;
    }
  }
  throw new CustomError({
    message: "Error al obtener imagen de Unsplash",
  });
}
