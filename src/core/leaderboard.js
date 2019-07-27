import { API_ROOT } from "../urls";
import { myFetchWrapper } from "../utils";

export function fetchSegmentLeaderboard(accessToken, segmentId) {
  let url = new URL(`${API_ROOT}/segments/${segmentId}/leaderboard`);
  return myFetchWrapper(url, {
    "headers": {
      "Authorization": `Bearer ${accessToken}`
    }
  })
    .then(leaderboard => leaderboard.entries)
}

export function findIfAthleteTakesHighPlaceInLeaderboard(leaderboard, athleteName) {
  let entry = leaderboard.find(score => score.athlete_name === athleteName);
  if (entry && entry.rank <= 10)
    return entry.rank;
  return null;
}