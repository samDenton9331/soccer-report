// API https://developers.strava.com/docs/getting-started/
// https://medium.com/@sunny_codes/strava-api-request-all-activities-data-node-js-811c2e7b0261
// https://www.strava.com/settings/api

require("dotenv").config();
const StravaApiV3 = require("strava_api_v3");
const defaultClient = StravaApiV3.ApiClient.instance;
const axios = require("axios");
const accessToken = process.env.ACCESS_TOKEN;

const getData = async () => {
  try {
    const response = await axios.get("https://www.strava.com/api/v3/athlete", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(`Status code: ${response.status}`);
    console.log(response.data);
  } catch (err) {
    console.error("Error: ", err);
  }
};

// getData();

// Strava API https://developers.strava.com/docs/getting-started/

const strava_oauth = defaultClient.authentications["strava_oauth"];
strava_oauth.accessToken = accessToken;

const api = new StravaApiV3.ActivitiesApi();

const options = {
  // before
  // after
  page: 1,
  perPage: 50,
};

let myActivities = [];
let hasMoreActivities = true;

const callback = (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    // no errors, api returned data
    console.log("retrieving activities data ...");

    myActivities = myActivities.concat(data);

    if (data.length > 0) {
      options.page += 1;
      api.getLoggedInAthleteActivities(options, callback);
    } else {
      // no more data
      console.log(">>> myActivities.length: ", myActivities.length);
      console.log(">>> final page number: ", options.page);
      console.log(">>> myActivities: ", myActivities);
      console.log(">>> remaining data: ", data.length);
    }
  }
};

// API Endpoint: GET /athlete/activities
// https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities

api.getLoggedInAthleteActivities(options, callback);