import type { ModsRequestItem } from '../routes/api/mods.json';
import { writable } from 'svelte/store';
import type { OctokitAuthenticatedUser } from './octokit';
import type { Octokit } from 'octokit';
import type { DownloadHistory } from './helpers/api/get-download-history';
import type { ModDatabase, ModTag } from './helpers/api/get-mod-database';

export const modList = writable<ModsRequestItem[]>([]);

export const modDatabase = writable<ModDatabase | undefined>();

export const githubUser = writable<OctokitAuthenticatedUser | undefined>();

export const octokit = writable<Octokit | undefined>();

export const downloadHistory = writable<DownloadHistory | undefined>();

export const tagList = writable<ModTag[]>();
