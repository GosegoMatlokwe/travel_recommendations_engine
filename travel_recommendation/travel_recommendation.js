document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("btn-search");
    const clearBtn = document.getElementById("btn-clear");
    const resultWrapper = document.getElementById("result-wrapper");

    searchBtn.addEventListener("click", executeSearchRoute);
    clearBtn.addEventListener("click", clearResultViewport);

    function executeSearchRoute() {
        const rawInput = searchInput.value.trim().toLowerCase();
        
        if (!rawInput) {
            alert("Please provide a valid destination category keyword entry.");
            return;
        }

        let normalizedQuery = rawInput;
        if (rawInput === "beach" || rawInput === "beaches") {
            normalizedQuery = "beaches";
        } else if (rawInput === "temple" || rawInput === "temples") {
            normalizedQuery = "temples";
        } else if (rawInput === "country" || rawInput === "countries") {
            normalizedQuery = "countries";
        }

        // Using relative dot paths for clean static server host handling
        fetch("./travel_recommendation_api.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network validation failed parsing internal resource files.");
                }
                return response.json();
            })
            .then(data => {
                console.log("Data Payload Successfully Extracted:", data);
                renderResultsGrid(normalizedQuery, data);
            })
            .catch(error => {
                console.error("Critical error mapping execution processing path:", error);
                resultWrapper.innerHTML = `<p style="color:#ef4444;">Error retrieving matching data logs.</p>`;
            });
    }

    function renderResultsGrid(keyword, dataset) {
        resultWrapper.innerHTML = "";
        let compiledCardsHTML = "";

        if (keyword === "beaches" && dataset.beaches) {
            dataset.beaches.forEach(item => {
                compiledCardsHTML += generateCardElementHTML(item.name, item.imageUrl, item.description);
            });
        } else if (keyword === "temples" && dataset.temples) {
            dataset.temples.forEach(item => {
                compiledCardsHTML += generateCardElementHTML(item.name, item.imageUrl, item.description);
            });
        } else if (keyword === "countries" && dataset.countries) {
            dataset.countries.forEach(country => {
                country.cities.forEach(city => {
                    compiledCardsHTML += generateCardElementHTML(city.name, city.imageUrl, city.description);
                });
            });
        } else {
            let directCountryMatch = dataset.countries.find(c => c.name.toLowerCase() === keyword);
            if (directCountryMatch) {
                directCountryMatch.cities.forEach(city => {
                    compiledCardsHTML += generateCardElementHTML(city.name, city.imageUrl, city.description);
                });
            } else {
                resultWrapper.innerHTML = `<p style="color:#94a3b8; text-align:center; background:rgba(15,23,42,0.9); padding:2rem; border-radius:8px; grid-column: span 2;">No matching results found. Try 'beach', 'temple', or a country name.</p>`;
                return;
            }
        }

        resultWrapper.innerHTML = compiledCardsHTML;
    }

    function generateCardElementHTML(title, imgUrl, description) {
        return `
            <div class="result-card">
                <img src="${imgUrl}" alt="${title}">
                <div class="card-body">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <button class="btn btn-search" style="width:100%; margin-top:auto;">View Details</button>
                </div>
            </div>
        `;
    }

    function clearResultViewport() {
        searchInput.value = "";
        resultWrapper.innerHTML = "";
        console.log("Interface state tracking flags cleared successfully.");
    }
});