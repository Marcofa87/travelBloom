function fetchRecommendations() {
  const input = document.getElementById("conditionInput").value.toLowerCase();
  const resultDiv = document.getElementById("result");

  if (!resultDiv) {
    const newResultDiv = document.createElement("div");
    newResultDiv.id = "result";
    document.querySelector("main").appendChild(newResultDiv);
  }

  resultDiv.innerHTML = "";

  fetch("./travel_recommendations.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      let results = [];

      // Cerca nei paesi e nelle loro città
      const countryMatch = data.countries.find((country) =>
        country.name.toLowerCase().includes(input)
      );

      if (countryMatch) {
        results = results.concat(
          countryMatch.cities.map((city) => ({
            name: city.name,
            description: city.description,
            imageUrl: city.imageUrl,
          }))
        );
      }

      // Cerca nelle città di tutti i paesi
      /* data.countries.forEach((country) => {
        const cityMatches = country.cities.filter((city) =>
          city.name.toLowerCase().includes(input)
        );
        results = results.concat(
          cityMatches.map((city) => ({
            name: city.name,
            description: city.description,
            imageUrl: city.imageUrl,
          }))
        );
      }); */

      // Cerca nei templi
      const templeMatches = data.temples.filter((temple) =>
        temple.name.toLowerCase().includes(input)
      );
      results = results.concat(
        templeMatches.map((temple) => ({
          name: temple.name,
          description: temple.description,
          imageUrl: temple.imageUrl,
        }))
      );

      // Cerca nelle spiagge
      const beachMatches = data.beaches.filter((beach) =>
        beach.name.toLowerCase().includes(input)
      );
      results = results.concat(
        beachMatches.map((beach) => ({
          name: beach.name,
          description: beach.description,
          imageUrl: beach.imageUrl,
          type: "beach",
        }))
      );

      // Visualizza i risultati
      if (results.length > 0) {
        results.forEach((result) => {
          const recommendationDiv = document.createElement("div");
          recommendationDiv.className = "recommendation-item";
          recommendationDiv.innerHTML = `
            <div class="recommendation-content">
              <img src="${result.imageUrl}" alt="${result.name}" />
              <div class="recommendation-text">
                <h3>${result.name}</h3>
                <p>${result.description}</p>
              </div>
            </div>
          `;
          resultDiv.appendChild(recommendationDiv);
        });
      } else {
        resultDiv.innerHTML = "Nessun risultato trovato";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      resultDiv.innerHTML = "Si è verificato un errore durante la ricerca";
    });
}

// Aggiungi gli event listener
const btnSearch = document.getElementById("btnSearch");
const btnClear = document.getElementById("btnClear");
const conditionInput = document.getElementById("conditionInput");

btnSearch.addEventListener("click", fetchRecommendations);
btnClear.addEventListener("click", () => {
  conditionInput.value = "";
  const resultDiv = document.getElementById("result");
  if (resultDiv) {
    resultDiv.innerHTML = "";
  }
});

conditionInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    fetchRecommendations();
  }
});
