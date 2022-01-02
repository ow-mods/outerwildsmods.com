import type { Octokit as OctokitInstance } from 'octokit/dist-types/octokit';

type OctokitRepos<T> = Awaited<ReturnType<OctokitInstance['rest']['repos'][T]>>['data'];
type OctokitGit<T> = Awaited<ReturnType<OctokitInstance['rest']['git'][T]>>['data'];

export type OctokitAuthenticatedUser = Awaited<
	ReturnType<OctokitInstance['rest']['users']['getAuthenticated']>
>['data'];

export type OctokitRepoArray = OctokitRepos<'listForAuthenticatedUser'>;
export type OctokitRepo = OctokitRepos<'get'>;

type OctokitCreateTreeParams = Parameters<OctokitInstance['rest']['git']['createTree']>[0];
const treeParams: OctokitCreateTreeParams;
export type OctokitTree = typeof treeParams.tree;
