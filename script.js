const sound = document.getElementById("flip-sound");
const toggle = document.getElementById("toggle");

let currentTheme = localStorage.getItem("theme") || "light";
document.body.classList.add(currentTheme);
toggle.checked = currentTheme === "dark";

toggle.addEventListener("change", () => {
  currentTheme = toggle.checked ? "dark" : "light";
  document.body.classList.remove("light", "dark");
  document.body.classList.add(currentTheme);
  localStorage.setItem("theme", currentTheme);
});

document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
  const card = wrapper.querySelector(".card");

  wrapper.addEventListener("click", () => {
    card.classList.toggle("flipped");

    if (sound.canPlayType("audio/mpeg")) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  });
});
