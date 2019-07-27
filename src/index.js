import { loadTop10Segments, loadUserTokens, saveTop10Segments, saveUserTokens } from "./localstorage";
import { API_AUTHORIZE} from "./urls";
import { addParamsToURL, isTokenAboutToExpire } from "./utils";
import { refreshTokens } from "./authorization/refreshToken";
import { findSegmentsWhereAthleteTakesTop10Position } from "./core";
import StravaError from "./api/StravaError";
import { fetchSegmentName } from "./core/segments";
import { CLIENT_ID } from "./config";

(async () => {
  let tokens = loadUserTokens();
  if (!tokens)
    return openAuthenticationWindow();

  let {
    expires_at : expiresAt,
    refresh_token : refreshToken,
    access_token : accessToken
  } = tokens;

  try {
    if (isTokenAboutToExpire(expiresAt)) {
      tokens = await refreshTokens(refreshToken);
      saveUserTokens(tokens);
    }

    let segments = await findSegmentsWhereAthleteTakesTop10Position(accessToken);
    saveTop10Segments(segments);
    showSummary(accessToken, segments);
    // showSummary(accessToken);
  } catch (error) {
    if (error instanceof StravaError) {
      let { message, json } = error;
      let errors = JSON.stringify(json, null, 4);
      document.write(`<p>${message}</p>`);
      document.write(`<p>${errors}</p>`);
    } else {
      document.write(error);
      throw error;
    }
  }
})();

function openAuthenticationWindow() {
  const width = 600;
  const height = 600;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  const url = new URL(API_AUTHORIZE);
  addParamsToURL(url, {
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: "http://localhost:9000/authorization",
    scope: "read,activity:read"
  });

  return window.open(
    url.href,
    "",
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,
    width=${width}, height=${height}, top=${top}, left=${left}`
  );
}

function showSummary(accessToken, segments = loadTop10Segments()) {
  const container = document.getElementById("container");
  for (const segment of segments) {
    fetchSegmentName(accessToken, segment.id)
      .then(name => {
        const a = document.createElement("a");
        a.textContent = `${name}, Pozycja: ${segment.rank}`;
        a.setAttribute("href", `https://www.strava.com/segments/${segment.id}/`);
        container.append(a);
      });
  }
}