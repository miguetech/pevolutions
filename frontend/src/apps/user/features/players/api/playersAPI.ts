import { api } from '@/shared/lib/api';
import type { Player } from '@/shared/types/player';

export type { Player };

export interface PlayerStats {
  id: number;
  name: string;
  level: number;
  vocation: number;
  experience: number;
  health: number;
  healthmax: number;
  sex: number;
  skill_fishing: number;
  onlinetime: number;
  lastlogin: number;
  lastlogout: number;
  pokemon_count: number;
}

export interface PokemonTeam {
  name: string;
  pokemon1: number | null;
  pokemon2: number | null;
  pokemon3: number | null;
  pokemon4: number | null;
  pokemon5: number | null;
  pokemon6: number | null;
}

export const getPlayers = () => api.get('api/players/').json<Player[]>();

export const createPlayer = (data: { name: string; sex: number }) =>
  api.post('api/players/', { json: data }).json<Player>();

export const deletePlayer = (name: string) =>
  api.delete(`api/players/${name}`).json();

export const getPlayerByName = (name: string) =>
  api.get(`api/players/${name}`).json<Player>();

export const getPlayerStats = (name: string) =>
  api.get(`api/players/${name}/stats`).json<PlayerStats>();

export const getPlayerPokemon = (name: string) =>
  api.get(`api/players/${name}/pokemon`).json<PokemonTeam>();

export const playersAPI = {
  getPlayers,
  getAll: getPlayers,
  getOnline: (params?: { limit?: number; sort_by?: string; search?: string }) =>
    api.get('api/players/online', { searchParams: params }).json<Player[]>(),
  createPlayer,
  create: createPlayer,
  deletePlayer,
  getPlayerByName,
  getPlayerStats,
  getPlayerPokemon,
};
