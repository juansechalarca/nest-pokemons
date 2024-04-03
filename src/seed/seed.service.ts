import { Inject, Injectable } from '@nestjs/common';

import { PokemonResponse } from './interfaces/pokemon-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private axiosAdapter: AxiosAdapter
    ){}

    async executeSeed(){
        await this.pokemonModel.deleteMany({});
        const data = await this.axiosAdapter.get<PokemonResponse>('http://pokeapi.co/api/v2/pokemon?limit=650');
        const pokemonToInsert: {name:string, no:number}[]= [];
        data.results.forEach(({name, url}) => {
            const segments = url.split('/');
            const no = +segments[segments.length -2];
            pokemonToInsert.push({name,no});
        });
        await this.pokemonModel.insertMany(pokemonToInsert);
        return 'seed executed'
    }
}
