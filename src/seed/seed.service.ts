import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      "https://pokeapi.co/api/v2/pokemon?limit=650"
    );

    data.results.forEach((pokemon) => {
      const id = pokemon.url.split("/")[6];
      
    });

    return data.results;
  }
}
