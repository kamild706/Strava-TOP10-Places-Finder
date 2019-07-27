class StravaError extends Error {
  name = "StravaError";

  constructor(response, json) {
    super(`${json.message} for ${response.url}`);
    this.response = response;
    this.json = json;
  }
}

export default StravaError;