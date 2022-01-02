import type { ModsRequestItem } from '../routes/api/mods.json';
import { writable } from 'svelte/store';
import type { OctokitAuthenticatedUser } from './octokit';
import type { Octokit } from 'octokit';

export const modsStore = writable<ModsRequestItem[]>([]);

export const githubUserStore = writable<OctokitAuthenticatedUser | undefined>();

export const octokitStore = writable<Octokit | undefined>();
