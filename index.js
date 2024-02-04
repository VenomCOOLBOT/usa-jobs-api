const request = require("request");
const fs = require("fs");

const host = "data.usajobs.gov";
const userAgent = "cpitney@pitney.us";
const authKey = "mA03dc38+Stfq0V4Fv9g3SVgyNOFuB41wwGaCLw1rgo=";

const keyword = "IT Project Manager";
const location = "San Diego, California";

function searchJobs(keyword, location) {
  const apiUrl = `https://data.usajobs.gov/api/search?PositionTitle=${encodeURIComponent(keyword)}&LocationName=${encodeURIComponent(location)}&ResultsPerPage=500`;

  request(
    {
      url: apiUrl,
      method: "GET",
      headers: {
        Host: host,
        "User-Agent": userAgent,
        "Authorization-Key": authKey,
      },
    },
    (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      }

      try {
        const data = JSON.parse(body);
        const results = data.SearchResult.SearchResultItems;

        console.log(results);
        downloadResult(results);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
      }
    }
  );
}

function downloadResult(results) {
  const sanitizedResults = sanitizeResults(results);
  const fileName = `${keyword.toLowerCase().replace(/\s+/g, "-")}-jobs.json`;

  fs.writeFile(fileName, JSON.stringify(sanitizedResults), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log(`Results saved to ${fileName}`);
  });
}

function sanitizeResults(results) {
  return results.map((result) => sanitizeResult(result));
}

function sanitizeResult(result) {
  for (const prop in result) {
    if (Object.prototype.hasOwnProperty.call(result, prop) && typeof result[prop] === 'string') {
      result[prop] = result[prop].replace(/[^\x20-\x7E]+/g, '');
    }
  }
  return result;
}

searchJobs(keyword, location);
