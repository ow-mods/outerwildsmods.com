import { writable } from 'svelte/store';
import type { DownloadHistory } from './helpers/api/get-download-history';

export const downloadHistory = writable<DownloadHistory | undefined>();

export const tagList = writable<string[]>([]);
