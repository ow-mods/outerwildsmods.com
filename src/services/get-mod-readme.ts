import axios, { AxiosResponse } from 'axios';

export const getModReadme = async (
  urls: string[]
): Promise<string | undefined> => {
  let response: AxiosResponse<string>;

  try {
    response = await axios.get<string>(urls[0]);
    if (response.status !== 200) {
      throw new Error(
        `Response not OK, status: ${(response.status, response.statusText)}`
      );
    }
  } catch {
    if (urls.length > 1) {
      return getModReadme(urls.slice(1, urls.length));
    } else {
      console.error('Could not find readme for this mod');
      return undefined;
    }
  }

  return response.data;
};
