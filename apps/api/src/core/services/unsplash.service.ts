import { Injectable } from "@nestjs/common";
import { createApi } from "unsplash-js";
import { CustomException } from "../exceptions/custom.exception";

type UnsplashType = ReturnType<typeof createApi>;

@Injectable()
export class UnsplashService {

  unsplash: UnsplashType;

  constructor() {
    this.unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
    });
  }

  async getRandomImage(queries: string[]): Promise<string> {
    let index = 0;
    while (index < queries.length) {
      try {
        const result = await this.unsplash.photos.getRandom({
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
    throw new CustomException({
      message: "Error al obtener imagen de Unsplash",
    });
  }

}