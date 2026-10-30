const API_URL = "https://ornithophile.vercel.app/api/birds?common_name=";
const userInput = document.getElementById("getName");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("birdResults");

const showMessage = (text) => {
    const heading = document.createElement("h2");
    heading.textContent = text;
    // Changed birdContainer to resultsContainer
    resultsContainer.textContent = "";
    resultsContainer.appendChild(heading);
};

const fetchBirds = async (query) => {
    showMessage("Getting Bird Info...");
    try {
        const response = await fetch(API_URL + encodeURIComponent(query));
        const data = await response.json();
        if (!data || data.length === 0) {
            // Changed single quotes to backticks for variable injection
            showMessage(`No birds found for "${query}".`);
            return;
        }
    } catch (error) {
        // Changed single quotes to backticks
        showMessage(`Error: ${error.message}`);
    }
}

userInput.addEventListener("click", () => {
    const query = searchInput.ariaValueMax.trim();

    if(!query){
        showMessage("Please enter a bird name.");
        return;
    }
    fetchBirds(query);
})