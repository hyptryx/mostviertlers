document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  loadVOD("2794184335", "vod-hyptryx");
  loadVOD("2766880312", "vod-tommecs");
});

/* Twitch VOD Thumbnail Loader */
function loadVOD(vodId, elementId) {
  const thumbUrl = `https://static-cdn.jtvnw.net/s3_vods/${vodId}/thumbnails/thumb0-640x360.jpg`;

  const img = document.getElementById(elementId);
  img.src = thumbUrl;

  img.onerror = () => {
    img.src = "img/vod-fallback.png";
  };
}

/* ---------------------------------------------------
   LIVE STATUS CHECKER
--------------------------------------------------- */
async function checkLiveStatus() {
  const channels = [
    { name: "hyptryx", element: "status-hyptryx" },
    { name: "tommecs", element: "status-tommecs" }
  ];

  const clientId = "120zjeo34vu3bpj4kedzrrhfu996jk";

  for (const ch of channels) {
    const url = `https://api.twitch.tv/helix/streams?user_login=${ch.name}`;

    const res = await fetch(url, {
      headers: { "Client-ID": clientId }
    });

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
  }
}

checkLiveStatus();
setInterval(checkLiveStatus, 60000);
