import express from "express";

import { Liquid } from "liquidjs";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const engine = new Liquid();
app.engine("liquid", engine.express());

app.set("views", "./views");

const baseUrl = "https://fdnd-agency.directus.app/items/into_";

const golfers = "golf_golfers";

const rounds = "golf_rounds";

const handicapHistory = "golf_handicap_history";

const milestones = "golf_milestones";

const monthlyRanking = "golf_monthly_ranking";

app.get("/", async function (request, response) {
	const golfer = await fetch(baseUrl + golfers + "/2");

	const scores = await fetch(
		baseUrl + rounds + "?filter[golfer_id][_eq]=2&sort=-date&limit=5",
	);

	const rankings = await fetch(
		baseUrl + monthlyRanking + "?filter[golfer_id][_eq]=2",
	);

	const milestone = await fetch(
		baseUrl + milestones + "?filter[golfer_id][_eq]=2",
	);

	const golferJson = await golfer.json();

	const scoresJson = await scores.json();

	const rankingsJson = await rankings.json();

	const milestoneJson = await milestone.json();

	response.render("index.liquid", {
		golfer: golferJson.data,
		scores: scoresJson.data,
		rankings: rankingsJson.data,
		milestones: milestoneJson.data,
	});
});

app.post("/score-toevoegen", async function (request, response) {
	const scoreUrl = await fetch(baseUrl + rounds);

	await fetch(scoreUrl.url, {
		method: "POST",
		body: JSON.stringify({
			golfer_id: request.body.golfer_id,
			date: request.body.date,
			course: request.body.course,
			differential: request.body.differential,
			type: request.body.type,
		}),

		headers: {
			"Content-Type": "application/json;charset=UTF-8",
		},
	});

	response.redirect(303, "/");
});

app.set("port", process.env.PORT || 8000);

app.listen(app.get("port"), function () {
	console.log(`http://localhost:${app.get("port")}`);
});
