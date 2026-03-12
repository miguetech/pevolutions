import { api } from '@/shared/lib/api';

export interface ServerInfo {
  online_count: number;
  status: string;
  uptime: string;
  version: string;
}

export interface TopPlayer {
  name: string;
  level: number;
  score: number;
}

export interface TopGuild {
  name: string;
  members: number;
  points: string;
  tag: string;
}

export interface SupportStaff {
  name: string;
  role: string;
  availability: string;
  languages: string[];
}

export interface Download {
  name: string;
  version: string;
  size: string;
  url: string;
  platform: string;
}

export const serverAPI = {
  getInfo: () => api.get('api/server/info').json<ServerInfo>(),
  getTopPlayers: (limit: number = 10) => 
    api.get('api/players/top', { searchParams: { limit } }).json<TopPlayer[]>(),
  getTopGuilds: (limit: number = 10) => 
    api.get('api/guilds/top', { searchParams: { limit } }).json<TopGuild[]>(),
  getSupportStaff: () => api.get('api/support/staff').json<SupportStaff[]>(),
  getDownloads: () => api.get('api/downloads').json<Download[]>(),
};
