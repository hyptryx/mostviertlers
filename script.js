/* ---------------------------------------------------
   INIT
--------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  checkLiveStatus();
  setInterval(checkLiveStatus, 60000); // alle 60 Sekunden
});

/* ---------------------------------------------------
   LIVE STATUS CHECKER (MIT TOKEN)
--------------------------------------------------- */
async function checkLiveStatus() {
  const channels = [
    { name: "hyptryx", element: "status-hyptryx" },
    { name: "tommecs", element: "status-tommecs" }
  ];

  const clientId = "120zjeo34vu3bpj4kedzrrhfu996jk";

  // 👉 HIER DEIN TOKEN EINTRAGEN
  const bearerToken = "yluu5fk92dhzez21szf3ek9grnq0fj";

  for (const ch of channels) {
    try {
      const url = `https://api.twitch.tv/helix/streams?user_login=${ch.name}`;

      const res = await fetch(url, {
        headers: {
          "Client-ID": clientId,
          "Authorization": `Bearer ${bearerToken}`
        }
      });

      if (!res.ok) {
        console.warn("Twitch API Fehler:", res.status, await res.text());
        continue;
      }

      const data = await res.json();
      const isLive = data.data && data.data.length > 0;

      const badge = document.getElementById(ch.element);
      if (!badge) continue;

      if (isLive) {
        badge.textContent = "🔴 LIVE";
        badge.classList.remove("offline");
        badge.classList.add("live");
      } else {
        badge.textContent = "🟡 OFFLINE";
        badge.classList.remove("live");
        badge.classList.add("offline");
      }
    } catch (err) {
      console.error("Fehler beim Abrufen des Twitch-Status:", err);
    }
  }
}
