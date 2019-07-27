import { API_ROOT } from "../urls";
import { myFetchWrapper } from "../utils";

export function findSegmentsWithAchievementsAtUploadTime(activityDetails) {
  let { achievements: leftToFind, segment_efforts: efforts } = activityDetails;
  let segments = [];

  for (let effort of efforts) {
    if (leftToFind === 0) return segments;

    const {
      kom_rank,
      pr_rank,
      segment: { id, private: isPrivate }
    } = effort;

    if (!isPrivate) {
      if (kom_rank || pr_rank)
        leftToFind--;
      if (kom_rank)
        segments.push({ id, kom_rank });
    }
  }

  return segments;
}

export function collectSegmentsAndRank(segments, pool) {
  segments.forEach(segment => {
    const index = pool.findIndex(s => s.id === segment.id);
    if (index > -1) {
      let current = pool[index];
      current.kom_rank = Math.min(current.kom_rank, segment.kom_rank);
    }
    else {
      pool.push(segment);
    }
  });

  return pool;
}

export function fetchSegmentName(accessToken, segmentId) {
  let url = new URL(`${API_ROOT}/segments/${segmentId}`);
  return myFetchWrapper(url, {
    "headers": {
      "Authorization": `Bearer ${accessToken}`
    }
  })
    .then(json => json.name);
}