const API_URL = "https://ornithophile.vercel.app/api/birds?common_name=";
const searchBtn = document.getElementById("getName");
const loadManyBtn = document.getElementById("loadManyButton")
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("birdResults");

const showMessage = (text) => {
    const heading = document.createElement("h2");
    heading.textContent = text;
    resultsContainer.textContent = "";
    resultsContainer.appendChild(heading);
};

const getBirdImageUrl = (bird) => {
    let rawUrl = bird.male_image || bird.female_image || "";

    if (!rawUrl && Array.isArray(bird.other_images)) {
        const photo = bird.other_images.find(
            (img) => img.source && !img.source.includes("Status_iucn")
        );
        if (photo) {
            rawUrl = photo.source;
        }
    }

    if (!rawUrl) return "";
    if (rawUrl.startsWith("//")) {
        return "https:" + rawUrl;
    }
    return rawUrl;
};

const renderBirds = (birds) => {
    resultsContainer.textContent = "";

    birds.forEach((bird) => {
        const pairWrapper = document.createElement("div");
        pairWrapper.className = "bird-pair";

        const imageCard = document.createElement("div");
        imageCard.className = "card image-card";

        const imgUrl = getBirdImageUrl(bird);
        if (imgUrl) {
            const img = document.createElement("img");
            img.src = imgUrl;
            img.alt = bird.common_name || "Bird image";
            imageCard.appendChild(img);
        } else {
            const noImgText = document.createElement("p");
            noImgText.textContent = "No image available for this bird.";
            imageCard.appendChild(noImgText);
        }

        const infoCard = document.createElement("div");
        infoCard.className = "card info-card";

        const title = document.createElement("h3");
        title.textContent = bird.common_name || "Unknown Bird";
        infoCard.appendChild(title);

        const sciName = document.createElement("p");
        sciName.textContent = `Scientific Name: ${bird.scientific_name || "N/A"}`;
        infoCard.appendChild(sciName);

        // Include optional taxonomy or status fields if the API provides them
        const fields = [
            { label: "Kingdom", key: "kingdom" },
            { label: "Phylum", key: "phylum" },
            { label: "Class", key: "class" },
            { label: "Order", key: "order" },
            { label: "Family", key: "family" },
            { label: "Genus", key: "genus" },
            { label: "Species", key: "species" },
            { label: "Conservation Status", key: "conservation_status" }
        ];

        fields.forEach((field) => {
            if (bird[field.key]) {
                const p = document.createElement("p");
                p.textContent = `${field.label}: ${bird[field.key]}`;
                infoCard.appendChild(p);
            }
        });

        if (bird.sources) {
            const sourcePara = document.createElement("p");
            const sourceLink = document.createElement("a");
            sourceLink.href = bird.sources;
            sourceLink.target = "_blank";
            sourceLink.textContent = "Read more on Wikipedia";
            sourcePara.appendChild(sourceLink);
            infoCard.appendChild(sourcePara);
        }

        pairWrapper.appendChild(imageCard);
        pairWrapper.appendChild(infoCard);
        resultsContainer.appendChild(pairWrapper);
    });
};

const fetchBirdsByName = async (query) => {
    showMessage("Getting Bird Info...");
    try {
        const response = await fetch(`${BASE_URL}?common_name=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        const birds = Array.isArray(data) ? data : (data.data || []);

        if (!birds || birds.length === 0) {
            showMessage(`No birds found for "${query}".`);
            return;
        }
        renderBirds(birds.slice(0, 25));
    } catch (error) {
        showMessage(`Error fetching bird data: ${error.message}`);
    }
};

const fetchTwentyBirds = async () => {
    showMessage("Loading 25 birds...");
    try {
        const response = await fetch(`${BASE_URL}/alpha/s`);
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        const birds = Array.isArray(data) ? data : (data.data || []);

        if (!birds || birds.length === 0) {
            showMessage("No birds found.");
            return;
        }
        renderBirds(birds.slice(0, 25));
    } catch (error) {
        showMessage(`Error fetching birds: ${error.message}`);
    }
};

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) {
        showMessage("Please enter a bird name.");
        return;
    }
    fetchBirdsByName(query);
});

loadManyBtn.addEventListener("click", () => {
    fetchTwentyBirds();
});