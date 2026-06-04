import express from "express";

import {Liquid} from "liquidjs";

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

const engine = new Liquid();
app.engine("liquid", engine.express());

app.set("views", "./views");

const golfers = "https://fdnd-agency.directus.app/items/into_golf_golfers";

const handicapHistory =
  "https://fdnd-agency.directus.app/items/into_golf_handicap_history";

const milestones =
  "https://fdnd-agency.directus.app/items/into_golf_milestones";

const monthlyRanking =
  "https://fdnd-agency.directus.app/items/into_golf_monthly_ranking";

app.get("/", async function (request, response) {
  const golfer = await fetch(golfers + "/1");

  const scores = await fetch(
    "https://fdnd-agency.directus.app/items/into_golf_rounds?filter[golfer_id][_eq]=1&sort=-date&limit=5",
  );

  const scoresJson = await scores.json();

  console.log(scoresJson);

  const golferJson = await golfer.json();

  response.render("index.liquid", {
    golfer: golferJson.data,
    scores: scoresJson.data,
  });
});

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
  console.log(`http://localhost:${app.get("port")}`);
});
