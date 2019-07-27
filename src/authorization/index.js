import { API_TOKEN_EXCHANGE} from "../urls";
import { addParamsToURL, myFetchWrapper, pick } from "../utils";
import { saveUserTokens } from "../localstorage";
import StravaError from "../api/StravaError";
import { CLIENT_ID, CLIENT_SECRET } from "../config";

(() => {
  let url = window.location.href;
  let code = extractCodeFromURL(url);
  if (code) {
    exchangeTokens(code)
      .then(onFulfilled)
      .catch(onRejected);
  }
})();

function onFulfilled(tokens) {
  if (saveUserTokens(tokens))
    document.write("Close this window and refresh previous page");
  else
    document.write("Couldn't save tokens to LocalStorage.");
}

function onRejected(error) {
  if (error instanceof StravaError) {
    let { message, json } = error;
    let errors = JSON.stringify(json, null, 4);
    document.write(message);
    document.write(errors);
  } else {
    document.write(error);
  }
}

function extractCodeFromURL(url) {
  const regex = /code=([^&]+)/;
  const match = regex.exec(url);
  return match ? match[1] : null;
}

function exchangeTokens(code) {
  let url = new URL(API_TOKEN_EXCHANGE);
  addParamsToURL(url, {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    grant_type: "authorization_code"
  });

  return myFetchWrapper(url.href, { method: "POST" })
    .then(pick("expires_at", "refresh_token", "access_token"));
}
