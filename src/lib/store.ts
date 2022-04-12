import type { ModsRequestItem } from '../routes/api/mods.json';
import { writable } from 'svelte/store';
import type { OctokitAuthenticatedUser } from './octokit';
import type { Octokit } from 'octokit';
import type { DownloadHistory } from './helpers/api/get-download-history';

export const modList = writable<ModsRequestItem[]>([]);

export const githubUser = writable<OctokitAuthenticatedUser | undefined>();

export const octokit = writable<Octokit | undefined>();

export const downloadHistory = writable<DownloadHistory | undefined>();
