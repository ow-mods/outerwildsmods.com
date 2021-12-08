const gitHubUrlBase = 'github';
const rawContentUrlBase = 'raw.githubusercontent';

export const getRawContentUrl = (repo: string) =>
  `${repo.replace(gitHubUrlBase, rawContentUrlBase)}/master`;
