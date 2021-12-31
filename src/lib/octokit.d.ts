import { Octokit as OctokitClass } from 'octokit';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
export type { File as OctokitPrFile } from 'octokit-plugin-create-pull-request/dist-types/types';

const OctokitClassWithPlugins = OctokitClass.plugin(createPullRequest);

export type Octokit = typeof OctokitClassWithPlugins;
export type OctokitInstance = InstanceType<typeof OctokitClassWithPlugins>;

export type OctokitAuthenticatedUser = Awaited<
	ReturnType<OctokitInstance['rest']['users']['getAuthenticated']>
>['data'];

export type OctokitRepoArray = Awaited<
	ReturnType<OctokitInstance['rest']['repos']['listForAuthenticatedUser']>
>['data'];

export type OctokitRepo = Awaited<ReturnType<OctokitInstance['rest']['repos']['get']>>['data'];

export type OctokitRelease = Awaited<
	ReturnType<OctokitInstance['rest']['repos']['getLatestRelease']>
>['data'];
