import StravaError from "./api/StravaError";

export function addParamsToURL(url, params) {
  Object.entries(params).forEach(entry =>
    url.searchParams.set(entry[0], entry[1])
  );
}

export const pick = (...props) => source =>
  props.reduce((acc, elem) => ({
    ...acc,
    [elem]: source[elem]
  }), {});

export async function myFetchWrapper(resource, init = {}) {
  const response = await fetch(resource, init);
  const json = await response.json();
  return response.ok ? json : throw new StravaError(response, json);
}

export function isTokenAboutToExpire(expiresAt) {
  let threshold = 10 * 60; // 10 minutes
  let timestamp = Math.floor(Date.now() / 1000);
  return expiresAt - timestamp < threshold;
}