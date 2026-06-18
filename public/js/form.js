const scoreForm = document.querySelector("#add-score");
const formButton = document.querySelector("#add-score button");
const scores = document.querySelector("#score");
const success = document.querySelector(".not-visible");

// Als er op de submit button wordt geklikt ...
scoreForm.addEventListener("submit", async function (event) {
	// Voorkom de standaard submit van de browser
	// Let op: hiermee overschrijven we de default Loading state van de browser...
	event.preventDefault();

	//Loading state tonen:
	formButton.classList.add("loading");
	formButton.innerHTML =
		"<img src='assests/loading.svg' alt='loading' width='42' height='42'>";

	//formdata voorbereiden:
	let formData = new FormData(scoreForm);

	// Data fetchen:
	// Doe een fetch naar de server, net als hoe de browser dit normaal zou doen
	// Gebruik daarvoor het action en method attribuut van het formulier
	// Stuur de formulierelementen mee
	const response = await fetch(scoreForm.action, {
		method: scoreForm.method, //POST dus
		body: new URLSearchParams(formData), // <<< Dit moet omdat server.js anders niet met de formulier data kan werken
	});

	// Data verwerken:
	// Jouw server.js geeft data terug als het posten goed gaat
	const responseData = await response.text();

	// Normaal zou de browser die HTML parsen en weergeven.
	// Maar omdat we dit nu in client-side JS doen moeten we dit zelf doen:
	// Parse de nieuwe HTML en maak onderwater een nieuw Document Object Model aan
	const parser = new DOMParser();
	const responseDOM = parser.parseFromString(responseData, "text/html");

	// Zoek in de onderwater DOM de nieuwe state op
	const newState = responseDOM.querySelector("#score");

	// Overschrijf de HTML met de nieuwe HTML
	// We gaan de nieuwe state toevoegen aan de DOM, aan de scorelijst in de ol
	scores.innerHTML = newState.innerHTML;

	// Loading state weghalen
	// Nu kan je waarschijnlijk de Loading state vervangen door een Success state
	formButton.classList.remove("loading");
	scoreForm.hidePopover();
	success.classList.add("visible");
});
