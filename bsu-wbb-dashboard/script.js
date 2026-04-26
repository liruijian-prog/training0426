const revealItems = document.querySelectorAll(".reveal");
const viewButtons = document.querySelectorAll("[data-view-trigger]");
const copyBlocks = document.querySelectorAll("[data-view-copy]");
const tabButtons = document.querySelectorAll("[data-tab-trigger]");
const tabPanels = document.querySelectorAll("[data-tab-panel]");
const rosterButtons = document.querySelectorAll(".roster-item");
const playerPanels = document.querySelectorAll("[data-player-panel]");

const viewMetrics = {
  latest: ["60", "71", "18+18", "负海大"],
  average: ["75.7", "67.0", "19.7+12.7", "1胜2负"],
  stage: ["89 最高", "48 最佳", "2 次两双", "+8.7"],
};

function setView(view) {
  viewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.viewTrigger === view);
  });

  document.querySelectorAll("[data-view-metric]").forEach((node, index) => {
    node.textContent = viewMetrics[view][index];
  });

  copyBlocks.forEach((node) => {
    node.classList.toggle("is-hidden", node.dataset.viewCopy !== view);
  });
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.viewTrigger;
    if (!view) return;
    setView(view);
  });
});

function setTab(tab) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tabTrigger === tab);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tabPanel === tab);
  });
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tabTrigger;
    if (!tab) return;
    setTab(tab);
  });
});

function setPlayer(player) {
  rosterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.player === player);
  });

  playerPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.playerPanel !== player);
  });
}

rosterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const player = button.dataset.player;
    if (!player) return;
    setPlayer(player);
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

setView("latest");
setTab("overview");
setPlayer("sun");
