// script.js

// Jahr im Footer setzen
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Twitch Live Check starten
  initTwitchLiveCheck();
});

// Twitch Live Check (NEUE METHODE – KEIN TOKEN NÖTIG)
async function initTwitchLiveCheck() {
  const channels = ["hyptryx", "tommecs"];
  const clientId = "120zjeo34vu3bpj4kedzrrhfu996jk"; // deine Client-ID

  for (const channel of channels) {
    try {
      const url = `https://api.twitch.tv/helix/streams?user_login=${channel}`;

      const res = await fetch(url, {
        headers: {
          "Client-ID": clientId
        }
      });

      const data = await res.json();
      const isLive = data.data && data.data.length > 0;

      const card = document.querySelector(`.twitch-card[data-channel="${channel}"]`);
      const badge = document.getElementById(`status-${channel}`);

      if (!card || !badge) continue;

      if (isLive) {
        card.classList.add("live");
        badge.classList.add("live");
        badge.textContent = "Live";
      } else {
        card.classList.remove("live");
        badge.classList.remove("live");
        badge.textContent = "Offline";
      }
    } catch (err) {
      console.error(`Fehler beim Abrufen des Twitch-Status für ${channel}:`, err);
    }
  }
}
