var request = require("request");
var fs = require("fs");

var host = "data.usajobs.gov";
var userAgent = "cpitney@pitney.us";
var authKey = "mA03dc38+Stfq0V4Fv9g3SVgyNOFuB41wwGaCLw1rgo=";

var keyword = "IT Project Manager";

var location = "San Diego, California";

function searchJobs(keyword, location) {
  var apiUrl = `https://data.usajobs.gov/api/search?PositionTitle=${encodeURIComponent(
    keyword
  )}&LocationName=${encodeURIComponent(location)}&ResultsPerPage=500`;

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
    function (_error, _response, body) {
      if (_error) {
        console.error(_error);
        return;
      }

      var data = JSON.parse(body);
      var results = data.SearchResult.SearchResultItems;

      console.log(results);
      downloadResult(results);
    }
  );
}

function downloadResult(results) {
  var sanitizedResults = sanitizeResults(results);
  var fileName = `${keyword.toLowerCase().replace(/\s+/g, "-")}-jobs.json`;

  fs.writeFile(fileName, JSON.stringify(sanitizedResults), function (err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Results saved to ${fileName}`);
  });
}

function sanitizeResults(results) {
  // Iterate through results and sanitize each item
  return results.map((result) => sanitizeResult(result));
}

function sanitizeResult(result) {
  for (var prop in result) {
    if (Object.prototype.hasOwnProperty.call(result, prop)) {
      if (typeof result[prop] === 'string') {
        // Check if the property value is a string before replacing non-printable characters
        result[prop] = result[prop].replace(/[^\x20-\x7E]+/g, '');
      }
    }
  }
  return result;
}



searchJobs(keyword, location);
