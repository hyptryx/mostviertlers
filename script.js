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
      const coverEl = document.getElementById(`cover-${channel}`);

      if (isLive) {
        const stream = streamData.data[0];

        badge.textContent = "LIVE";
        badge.classList.add("live");

        card.classList.add("live");

        gameEl.textContent = stream.game_name || "Unbekanntes Spiel";

        // GAME COVER LADEN
        const gameId = stream.game_id;
        if (gameId) {
          const gameRes = await fetch(
            `https://api.twitch.tv/helix/games?id=${gameId}`,
            { headers: { "Client-ID": clientId } }
          );
          const gameData = await gameRes.json();

          if (gameData.data && gameData.data.length > 0) {
            let boxArt = gameData.data[0].box_art_url;
            boxArt = boxArt.replace("{width}", "285").replace("{height}", "380");
            coverEl.src = boxArt;
          }
        }
      } else {
        badge.textContent = "OFFLINE";
        gameEl.textContent = "Derzeit offline";
        coverEl.src = "img/offline-cover.png"; // optionales Placeholder-Bild
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
