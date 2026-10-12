const DATA_URL = "js/boardingData.json";

let skiData = null;
let boardingData = null;
let showingBoarding = false;

// turns json to js object
async function loadBoardingData() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load ${DATA_URL} (status ${response.status})`);
  }
  return response.json();
}

// turns current page to object, for switching back
function captureSkiData() {
  const getCards = (gridId) =>
    Array.from(document.querySelectorAll(`#${gridId} .card`)).map((card) => ({
      title: card.querySelector("h3").textContent,
      description: card.querySelector("p").textContent,
    }));

  // get current image url from hero element
  const hero = document.getElementById("heroSection");
  const currentImage = getComputedStyle(hero).getPropertyValue("--hero-img").trim();

  return {
    title: document.title,
    header: document.getElementById("styleName").textContent,
    hero: {
      headline: document.getElementById("heroTitle").textContent,
      description: document.getElementById("heroDesc").textContent,
      image: currentImage,
    },
    sections: {
      overview: {
        title: document.getElementById("sec1Title").textContent,
        subtitle: document.getElementById("sec1Subtitle").textContent,
        cards: getCards("sec1Grid"),
      },
      equipment: {
        title: document.getElementById("sec2Title").textContent,
        subtitle: document.getElementById("sec2Subtitle").textContent,
        cards: getCards("sec2Grid"),
      },
    },
  };
}

// changes text and titles in the cards
function updateCards(gridId, cards) {
  const cardEls = document.querySelectorAll(`#${gridId} .card`);
  cardEls.forEach((cardEl, i) => {
    if (!cards[i]) return;
    cardEl.querySelector("h3").textContent = cards[i].title;
    cardEl.querySelector("p").textContent = cards[i].description;
  });
}

// changes the image
function updateHeroImage(image) {
  const hero = document.getElementById("heroSection");
  let cssValue = image;

  if (!image.trim().startsWith("url(")) {
    const cssHref = document.querySelector('link[rel="stylesheet"]').href;
    const absolute = new URL(image, cssHref).href;
    cssValue = `url("${absolute}")`;
  }

  hero.style.setProperty("--hero-img", cssValue);
}

// applys data object to the page
function applyContent(data) {
  document.title = data.title;
  document.getElementById("styleName").textContent = data.header;

  document.getElementById("heroTitle").textContent = data.hero.headline;
  document.getElementById("heroDesc").textContent = data.hero.description;
  updateHeroImage(data.hero.image);

  const { overview, equipment } = data.sections;

  document.getElementById("sec1Title").textContent = overview.title;
  document.getElementById("sec1Subtitle").textContent = overview.subtitle;
  updateCards("sec1Grid", overview.cards);

  document.getElementById("sec2Title").textContent = equipment.title;
  document.getElementById("sec2Subtitle").textContent = equipment.subtitle;
  updateCards("sec2Grid", equipment.cards);
}

/* event handling */

async function handleChangeClick() {
  try {
    
    if (!boardingData) {
      boardingData = await loadBoardingData();
    }

    showingBoarding = !showingBoarding;
    applyContent(showingBoarding ? boardingData : skiData);
  } catch (error) {
    console.error("Failed to change content:", error);
  }
}

function init() {
  skiData = captureSkiData();
  document
    .getElementById("changeThemeBtn")
    .addEventListener("click", handleChangeClick);
}

document.addEventListener("DOMContentLoaded", init);
