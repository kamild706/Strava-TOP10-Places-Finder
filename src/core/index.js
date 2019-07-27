import { loadSegments, saveSegments } from "../localstorage";
import { fetchActivityDetails, findAllUserActivitiesWithAchievements } from "./activities";
import { collectSegmentsAndRank, findSegmentsWithAchievementsAtUploadTime } from "./segments";
import { athleteName } from "./athlete";
import { fetchSegmentLeaderboard, findIfAthleteTakesHighPlaceInLeaderboard } from "./leaderboard";

export async function findSegmentsWhereAthleteTakesTop10Position(accessToken) {
  let segments = await collectSegmentsWithPotentiallyHighAthletePlace(accessToken);
  let name = await athleteName(accessToken);

  let topAthleteSegments = [];
  let computations = segments.map(segment => {
    return fetchSegmentLeaderboard(accessToken, segment.id)
      .then(leaderboard => {
        let rank = findIfAthleteTakesHighPlaceInLeaderboard(leaderboard, name);
        if (rank)
          topAthleteSegments.push({
            id: segment.id,
            rank
          });
      });
  });
  await Promise.all(computations);
  return topAthleteSegments;
}

async function collectSegmentsWithPotentiallyHighAthletePlace(accessToken) {
  let segments = loadSegments();
  if (segments)
    return segments;

  let activities = await findAllUserActivitiesWithAchievements(accessToken);
  let pool = [];

  activities.forEach(activity => {
    fetchActivityDetails(accessToken, activity.id)
      .then(findSegmentsWithAchievementsAtUploadTime)
      .then(segments => collectSegmentsAndRank(segments, pool));
  });

  let saved = saveSegments(pool);
  console.log(pool);
  console.log("saved", saved);
  return pool;
}