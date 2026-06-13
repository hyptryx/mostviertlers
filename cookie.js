document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");

  if (!banner || !acceptBtn || !declineBtn) return;

  const consent = localStorage.getItem("mst_cookie_consent");

  if (!consent) {
    banner.classList.remove("hidden");
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("mst_cookie_consent", "accepted");
    banner.classList.add("hidden");
  });

  declineBtn.addEventListener("click", () => {
    localStorage.setItem("mst_cookie_consent", "declined");
    banner.classList.add("hidden");
  });
});
