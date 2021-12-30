import type { ModsRequestItem } from '../routes/api/mods.json';
import { writable } from 'svelte/store';
import type { OctokitAuthenticatedUser, OctokitInstance } from './octokit';

export const modsStore = writable<ModsRequestItem[]>([]);

export const githubUserStore = writable<OctokitAuthenticatedUser | undefined>();

export const octokitStore = writable<OctokitInstance | undefined>();
