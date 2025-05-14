const spotlight = document.getElementById("spotlight");
const input = document.getElementById("spotlightInput");
const results = document.getElementById("spotlightResults");


const commands = [
  { name: "Home", action: () => window.scrollTo(0, 0) },
  { name: "About", action: () => document.getElementById("about")?.scrollIntoView() },
  { name: "Projects", action: () => document.getElementById("projects")?.scrollIntoView() },
  { name: "Contact", action: () => document.getElementById("contact")?.scrollIntoView() }
];

function openSpotlight() {
  spotlight.classList.remove("hidden");
  input.focus();
  input.value = "";
  updateResults("");
}

function closeSpotlight() {
  spotlight.classList.add("hidden");
}

function updateResults(query) {
  const filtered = commands.filter(cmd => cmd.name.toLowerCase().includes(query.toLowerCase()));
  results.innerHTML = "";
  filtered.forEach(cmd => {
    const li = document.createElement("li");
    li.textContent = cmd.name;
    li.onclick = () => {
      cmd.action();
      closeSpotlight();
    };
    results.appendChild(li);
  });
}

document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    if (spotlight.classList.contains("hidden")) {
      openSpotlight();
    } else {
      closeSpotlight();
    }
  }
  if (e.key === "Escape") closeSpotlight();
});

input.addEventListener("input", () => {
  updateResults(input.value);
});
