import { myFetchWrapper } from "../utils";
import { API_ROOT } from "../urls";

export async function athleteName(accessToken) {
  let url = new URL(`${API_ROOT}/athlete`);

  let athlete = await myFetchWrapper(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const { firstname: first, lastname: last } = athlete;
  const firstLetter = last.substring(0, 1);
  return `${first} ${firstLetter}.`;
}
