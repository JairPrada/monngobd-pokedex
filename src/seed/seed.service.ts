import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Pokemon } from "src/pokemon/entities/pokemon.entity";
import { AxiosAdapter } from "../common/adapters/axios.adapter";

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      "https://pokeapi.co/api/v2/pokemon?limit=650"
    );
    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach((pokemon) => {
      const segments = pokemon.url.split("/");
      const id = +segments[segments.length - 2];
      pokemonToInsert.push({
        name: pokemon.name,
        no: id,
      });
    });

    console.log(pokemonToInsert);

    await this.pokemonModel.insertMany(pokemonToInsert);

    return data.results;
  }
}
