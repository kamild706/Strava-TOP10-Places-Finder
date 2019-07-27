import { addParamsToURL, myFetchWrapper } from "../utils";
import { API_ROOT } from "../urls";

export async function findAllUserActivitiesWithAchievements(accessToken) {
  let activitiesWithAchievements = [];
  let page = 1;
  let browsedAllActivities = false;

  while (!browsedAllActivities) {
    let activities = await fetchUserActivitiesByPage(accessToken, page++);

    activities.forEach(activity => {
      const { id, achievement_count: achievements, type } = activity;
      if (achievements && type === "Ride")
        activitiesWithAchievements.push({ id, achievements });
    });

    browsedAllActivities = activities.length === 0;
  }

  return activitiesWithAchievements;
}

function fetchUserActivitiesByPage(accessToken, page) {
  let url = new URL(`${API_ROOT}/athlete/activities`);
  addParamsToURL(url, { page });

  return myFetchWrapper(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export function fetchActivityDetails(accessToken, activityId) {
  let url = new URL(`${API_ROOT}/activities/${activityId}`);
  return myFetchWrapper(url, {
    "headers": {
      "Authorization": `Bearer ${accessToken}`
    }
  });
}
