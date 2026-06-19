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

  const clientId = "5fytmsdqzv97o2l5altkoqqw7q5fuh";

  // 👉 HIER DEIN TOKEN EINTRAGEN
  const bearerToken = "rvf868a293a4s5ah3517xud04s8sws";

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
       
     const extra = document.getElementById("extra-" + ch.name);
       if (!extra) continue;
       if (isLive) {
        const stream = data.data[0];

          extra.style.display = "block";
          
      extra.innerHTML = `
           <strong>${stream.title}</strong><br>
           ${stream.game_name}<br>
           👀 ${stream.viewer_count} Zuschauer
      `;

      } else {
        extra.style.display = "none";
      }

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

/* ---------------------------------------------------
   CREATOR STATS – FOLLOWER, GAME, VIEWER, LAST STREAM
--------------------------------------------------- */

async function loadCreatorStats() {
  const clientId = "5fytmsdqzv97o2l5altkoqqw7q5fuh";
  const bearerToken = "rvf868a293a4s5ah3517xud04s8sws";

  const headers = {
    "Client-ID": clientId,
    "Authorization": `Bearer ${bearerToken}`
  };

  const creators = [
    {
      login: "hyptryx",
      followers: "sp-followers",
      laststream: "sp-laststream",
      game: "sp-game",
      viewers: "sp-viewers"
    },
    {
      login: "tommecs",
      followers: "tm-followers",
      laststream: "tm-laststream",
      game: "tm-game",
      viewers: "tm-viewers"
    }
  ];

  for (const c of creators) {
    try {
      // USER DATA (Follower)
      const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${c.login}`, { headers });
      const userData = await userRes.json();
      const user = userData.data[0];

      document.getElementById(c.followers).textContent = user.view_count;

      // STREAM DATA (Game, Viewer, Live/Offline)
      const streamRes = await fetch(`https://api.twitch.tv/helix/streams?user_login=${c.login}`, { headers });
      const streamData = await streamRes.json();

      if (streamData.data.length > 0) {
        const stream = streamData.data[0];

        document.getElementById(c.laststream).textContent = "LIVE";
        document.getElementById(c.game).textContent = stream.game_name;
        document.getElementById(c.viewers).textContent = stream.viewer_count;
      } else {
        document.getElementById(c.laststream).textContent = "Offline";
        document.getElementById(c.game).textContent = "–";
        document.getElementById(c.viewers).textContent = "–";
      }

    } catch (err) {
      console.error("Fehler beim Laden der Creator‑Stats:", err);
    }
  }
}

// Beim Laden der Seite ausführen
loadCreatorStats();
setInterval(loadCreatorStats, 60000); // alle 60 Sekunden
