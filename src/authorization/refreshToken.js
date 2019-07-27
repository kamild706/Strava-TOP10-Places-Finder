import { API_TOKEN_EXCHANGE} from "../urls";
import { addParamsToURL, myFetchWrapper, pick } from "../utils";
import { CLIENT_ID, CLIENT_SECRET } from "../config";

export function refreshTokens(code) {
  let url = new URL(API_TOKEN_EXCHANGE);
  addParamsToURL(url, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    grant_type: "refresh_token"
  });

  return myFetchWrapper(url.href, { method: "POST" })
    .then(pick("expires_at", "refresh_token", "access_token"));
}