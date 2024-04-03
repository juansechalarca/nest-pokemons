import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit:number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
    ){
      this.defaultLimit = configService.get<number>('defaultLimit');
    }
  async create(createPokemonDto: CreatePokemonDto) {
    try{
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon =  await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    }
    catch(err){
      this.handleExceptions(err,'Cannot create pokemon - check server log');
    }
   
  }

 async findAll(paginationDto:PaginationDto) {
  const {limit = this.defaultLimit, offset = 0} = paginationDto;
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({no:1})
    .select('-__v')

  }

  async findOne(term: string) {
    let pokemon:Pokemon;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no:term});
    }

    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});
    }

    if(!pokemon) throw new NotFoundException(`Pokemon with name, no or id ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try{
      const pokemon = await this.findOne(term);
      if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
      await pokemon.updateOne(updatePokemonDto,{new: true});
      return {...pokemon.toJSON, ...updatePokemonDto};
    }
    catch(err){
     this.handleExceptions(err,'Cannot update pokemon - check server log');
    }
   
  }

  async remove(id: string) {
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
      if(deletedCount === 0) throw new BadRequestException(`Pokemon with "${id}" no found`);
    return;
  }

  private handleExceptions(error:any, message:string){
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon already exist ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(message);
  }
}
