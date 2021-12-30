import type { Octokit as OctokitInstance } from 'octokit';
import { Octokit as OctokitClass } from 'octokit';

export type OctokitInstance = OctokitInstance;

export type Octokit = typeof OctokitClass;

export type OctokitAuthenticatedUser = Awaited<
	ReturnType<OctokitInstance['rest']['users']['getAuthenticated']>
>['data'];

export type OctokitRepoArray = Awaited<
	ReturnType<OctokitInstance['rest']['repos']['listForAuthenticatedUser']>
>['data'];

export type OctokitRepo = Awaited<ReturnType<OctokitInstance['rest']['repos']['get']>>['data'];
