// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();
const { StatusCodes } = require("http-status-codes");

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204
// for json
app.use(express.json());
// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date?", function (req, res) {
  const data = req.params;
  const date = data?.date;

  console.log("type:", typeof date);

  let utc;
  let unix;
  let dateNow = Date.now();

  console.log(":Date?" + "-user provided date- " + date);

  if (!date) {
    utc = new Date(dateNow).toUTCString();
    unix = dateNow;
    return res.status(StatusCodes.OK).json({
      unix,
      utc,
    });
  }

    let adate = "05 October 2011, GMT";

    if (date.includes(" ")) {
      
      let unix = Date.parse(date);
      let utc = new Date(unix).toUTCString();
      
      return res.status(StatusCodes.OK).json({
        unix,
        utc,
      });

    }

 

  try {
    if (validateUTCDate(date)) {
      utc = new Date(date).toUTCString();
      unix = new Date(date).getTime();
    } else if (new Date(Number(date)).getTime() > 0) {
      utc = new Date(Number(date)).toUTCString();
      unix = new Date(Number(date)).getTime();
    } else {
      return res.status(StatusCodes.OK).json({
        error: "Invalid Date",
      });
    }
  } catch (err) {
    return res.status(StatusCodes.OK).json({
      error: "Invalid Date",
    });
  }

  function validateUTCDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!regEx.test(dateString)) return false; // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  }

  return res.status(StatusCodes.OK).json({
    unix,
    utc,
  });
});

// const localport = 3000;
// const PORT = process.env.PORT;

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
