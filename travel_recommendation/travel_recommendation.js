/**
 * Core Application Engine State Configuration Mapping
 */
document.addEventListener("DOMContentLoaded", () => {
    // DOM Element Target Handles
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("btn-search");
    const clearBtn = document.getElementById("btn-clear");
    const resultWrapper = document.getElementById("result-wrapper");

    // Event Listener Attachers
    searchBtn.addEventListener("click", executeSearchRoute);
    clearBtn.addEventListener("click", clearResultViewport);

    /**
     * Task 6 & 7: Parse Application Engine Search Inputs Async Flow
     */
    function executeSearchRoute() {
        const rawInput = searchInput.value.trim().toLowerCase();
        
        if (!rawInput) {
            alert("Please provide a valid destination category keyword entry.");
            return;
        }

        // Clean query to point localized variations to centralized data model blocks
        let normalizedQuery = rawInput;
        if (rawInput === "beach" || rawInput === "beaches") {
            normalizedQuery = "beaches";
        } else if (rawInput === "temple" || rawInput === "temples") {
            normalizedQuery = "temples";
        } else if (rawInput === "country" || rawInput === "countries") {
            normalizedQuery = "countries";
        }

        // Task 6: Fetch API Core Implementation Pattern
        fetch("travel_recommendation_api.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network validation failed parsing internal resource files.");
                }
                return response.json();
            })
            .then(data => {
                // Console logging for verification testing assertions (Task 6 Required Checklist element)
                console.log("Data Payload Successfully Extracted:", data);
                
                renderResultsGrid(normalizedQuery, data);
            })
            .catch(error => {
                console.error("Critical error mapping execution processing path:", error);
                resultWrapper.innerHTML = `<p style="color:#ef4444;">Error retrieving matching data logs.</p>`;
            });
    }

    /**
     * Task 8: Dynamic Results Construction View Engine Mapping
     */
    function renderResultsGrid(keyword, dataset) {
        // Clear previous grid elements
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
            // Flatten country structures to pull nested city profiles cleanly
            dataset.countries.forEach(country => {
                country.cities.forEach(city => {
                    compiledCardsHTML += generateCardElementHTML(city.name, city.imageUrl, city.description);
                });
            });
        } else {
            // Handle unique text inputs matching exact country labels dynamically
            let directCountryMatch = dataset.countries.find(c => c.name.toLowerCase() === keyword);
            if (directCountryMatch) {
                directCountryMatch.cities.forEach(city => {
                    compiledCardsHTML += generateCardElementHTML(city.name, city.imageUrl, city.description);
                });
            } else {
                resultWrapper.innerHTML = `<p style="color:#94a3b8; text-align:center; background:rgba(15,23,42,0.9); padding:2rem; border-radius:8px;">No matching results found. Try 'beach', 'temple', or a country name.</p>`;
                return;
            }
        }

        // Inject computed template literals seamlessly inside target wrapper layout map
        resultWrapper.innerHTML = compiledCardsHTML;
    }

    /**
     * Helper Template Generation Function Construct
     */
    function generateCardElementHTML(title, imgUrl, description) {
        return `
            <div class="result-card">
                <img src="${imgUrl}" alt="${title}">
                <div class="card-body">
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <button class="btn btn-search" style="width:100%; margin-top:0.5rem;">View Details</button>
                </div>
            </div>
        `;
    }

    /**
     * Task 9: Clear Interface Viewport Elements Routine
     */
    function clearResultViewport() {
        searchInput.value = "";
        resultWrapper.innerHTML = "";
        console.log("Interface state tracking flags cleared successfully.");
    }
});