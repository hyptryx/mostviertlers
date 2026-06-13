document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initTwitchData();
});

async function initTwitchData() {
  const channels = ["hyptryx", "tommecs"];
  const clientId = "120zjeo34vu3bpj4kedzrrhfu996jk";

  for (const channel of channels) {
    try {
      // STREAM INFO
      const streamRes = await fetch(
        `https://api.twitch.tv/helix/streams?user_login=${channel}`,
        { headers: { "Client-ID": clientId } }
      );
      const streamData = await streamRes.json();
      const isLive = streamData.data && streamData.data.length > 0;

      const badge = document.getElementById(`live-${channel}`);
      const card = document.querySelector(`.twitch-card[data-channel="${channel}"]`);
      const gameEl = document.getElementById(`game-${channel}`);

      if (isLive) {
        const stream = streamData.data[0];

        badge.textContent = "LIVE";
        badge.style.background = "#ff0033";

        card.style.borderColor = "#4cffd7";
        card.style.boxShadow = "0 0 35px rgba(76,255,215,0.4)";

        gameEl.textContent = stream.game_name || "Unbekanntes Spiel";
      } else {
        badge.textContent = "OFFLINE";
        gameEl.textContent = "Derzeit offline";
      }

      // FOLLOWER COUNT
      const userRes = await fetch(
        `https://api.twitch.tv/helix/users?login=${channel}`,
        { headers: { "Client-ID": clientId } }
      );
      const userData = await userRes.json();
      const userId = userData.data[0].id;

      const followRes = await fetch(
        `https://api.twitch.tv/helix/users/follows?to_id=${userId}`,
        { headers: { "Client-ID": clientId } }
      );
      const followData = await followRes.json();

      const followerEl = document.getElementById(`followers-${channel}`);
      followerEl.textContent = followData.total.toLocaleString("de-DE") + " Follower";

    } catch (err) {
      console.error("Fehler beim Twitch-API Abruf:", err);
    }
  }
}
