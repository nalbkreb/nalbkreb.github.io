document.addEventListener("DOMContentLoaded", () => {
    const buttonSection = document.querySelector("section.buttons");
    const infoSection = document.querySelector("section.twoStepInfo");
    const footer = document.querySelector("footer");
    const copyrightNote = document.getElementById("imageCopyright");

    if (!buttonSection) return;

    const buttons = Array.from(buttonSection.querySelectorAll("button"));
    const instructions = infoSection ? infoSection.querySelector("p") : null;

    // saves the staring state for later
    const eraLabels = buttons.map((button) => button.textContent);
    const eraInstructions = instructions ? instructions.textContent : "";

    let data = null;          // contents of twoStepData.json
    let stage = "eras";       // eras to civs to info
    let currentEra = null;    // key of the era the user picked
    let infoView = null;      // the section showing the image + paragraphs

    // defining the back button so users can navigate back to the previous choice without reloading
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "backButton";
    backButton.addEventListener("click", goBack);

    const backSection = document.createElement("section");
    backSection.className = "backSection";
    backSection.appendChild(backButton);

    fetch("../js/twoStepData.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Could not load twoStepData.json");
            }
            return response.json();
        })
        .then((json) => {
            data = json;
        })
        .catch((error) => {
            console.error(error);
        });

    buttonSection.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button || !data) return;

        if (stage === "eras") {
            showCivilizationButtons(button.id);
        } else if (stage === "civilizations") {
            const index = buttons.indexOf(button);
            showCivilizationInfo(data[currentEra].civilizations[index]);
        }
    });

    function setCopyright(text) {
        if (copyrightNote) copyrightNote.textContent = text || "";
    }

    function showBackSection(label) {
        backButton.textContent = label;
        if (backSection.isConnected) return;

        if (footer) {
            footer.before(backSection);
        } else {
            buttonSection.parentElement.appendChild(backSection);
        }
    }

    // returns to the era buttons
    function showEras() {
        stage = "eras";
        currentEra = null;

        buttons.forEach((button, i) => {
            button.textContent = eraLabels[i];
        });

        if (instructions) instructions.textContent = eraInstructions;
        setCopyright("");
        backSection.remove();
    }

    function showCivilizationButtons(eraKey) {
        const era = data[eraKey];
        if (!era) return;

        currentEra = eraKey;
        stage = "civilizations";

        era.civilizations.forEach((civ, i) => {
            buttons[i].textContent = civ.name;
        });

        if (instructions) {
            instructions.textContent = "Now choose a civilization to learn about.";
        }

        setCopyright("");
        showBackSection("← Back to eras");
    }

    // shows the info once the choices are made
    function showCivilizationInfo(civ) {
        stage = "info";
        setCopyright(civ.copyright);

        const article = document.createElement("section");
        article.className = "civInfo";

        const heading = document.createElement("h2");
        heading.textContent = civ.name;

        const image = document.createElement("img");
        image.src = civ.image;
        image.alt = civ.alt;
        image.className = "civImage";

        article.append(heading, image);

        civ.paragraphs.forEach((text) => {
            const p = document.createElement("p");
            p.textContent = text;
            article.appendChild(p);
        });

        infoView = article;
        if (infoSection) infoSection.remove();
        buttonSection.replaceWith(article);

        showBackSection("← Back to civilizations");
    }

    // functionality of the back button
    function goBack() {
        if (stage === "info") {
            // Put the original sections back, in their original order
            infoView.replaceWith(buttonSection);
            if (infoSection) buttonSection.before(infoSection);
            infoView = null;
            showCivilizationButtons(currentEra);
        } else if (stage === "civilizations") {
            showEras();
        }
    }
})
