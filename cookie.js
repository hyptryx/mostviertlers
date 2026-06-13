document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");

  // Prüfen ob bereits gewählt wurde
  const choice = localStorage.getItem("cookie-choice");

  if (!choice) {
    banner.classList.remove("hidden");
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookie-choice", "accepted");
    banner.classList.add("hidden");
  });

  declineBtn.addEventListener("click", () => {
    localStorage.setItem("cookie-choice", "declined");
    banner.classList.add("hidden");
  });
});
