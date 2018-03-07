import mongoose from 'mongoose';
import matchSchema from '../schemas/match';
import playerSchema from '../schemas/player';

mongoose.set('debug', true);

export const Match = mongoose.model('Match', matchSchema, 'matches');
export const Player = mongoose.model('Player', playerSchema, 'players');
