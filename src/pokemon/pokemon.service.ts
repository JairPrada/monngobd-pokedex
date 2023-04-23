import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";
import { UpdatePokemonDto } from "./dto/update-pokemon.dto";
import { Pokemon } from "./entities/pokemon.entity";
import { Model, isValidObjectId } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (err) {
      this.handleExceptions(err);
    }
  }

  findAll(queryParameters: PaginationDto) {
    const { limit = 10, offset = 0 } = queryParameters;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select({  __v: 0 });
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // By No
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // By Id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // By Name

    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });

    // Not Found
    if (!pokemon) throw new NotFoundException(`Pokemon ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (!pokemon) throw new NotFoundException(`Pokemon ${term} not found`);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      try {
        await pokemon.updateOne(updatePokemonDto, { new: true });
        return { ...pokemon.toJSON(), ...updatePokemonDto };
      } catch (err) {
        this.handleExceptions(err);
      }
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon ${id} not found`);

    return;
  }

  private handleExceptions(err: any) {
    if (err.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists ${JSON.stringify(err.keyValue)}`
      );
    }
    throw new InternalServerErrorException(
      `Cant update pokemon you should see logs`
    );
  }
}
