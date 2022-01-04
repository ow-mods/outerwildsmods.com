import type { Octokit } from 'octokit';

type OctokitRest = Octokit['rest'];

type OctokitRepos<T> = Awaited<ReturnType<OctokitRest['repos'][T]>>['data'];

export type OctokitAuthenticatedUser = Awaited<
	ReturnType<OctokitRest['users']['getAuthenticated']>
>['data'];

export type OctokitRepoArray = OctokitRepos<'listForAuthenticatedUser'>;
export type OctokitRepo = OctokitRepos<'get'>;
export type OctokitCreatedRepo = OctokitRepos<'createUsingTemplate'>;

type OctokitCreateTreeParams = Parameters<Octokit['rest']['git']['createTree']>[0];
const treeParams: OctokitCreateTreeParams;
export type OctokitTree = typeof treeParams.tree;
