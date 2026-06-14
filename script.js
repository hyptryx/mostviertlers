document.addEventListener("DOMContentLoaded", () => {
  // Jahr im Footer setzen
  document.getElementById("year").textContent = new Date().getFullYear();

  // VOD Thumbnails laden
  loadVOD("2794184335", "vod-hyptryx");
  loadVOD("2766880312", "vod-tommecs");
});

/* ---------------------------------------------------
   VOD THUMBNAIL LOADER
   Twitch liefert Thumbnails über eine fixe URL-Struktur
--------------------------------------------------- */
function loadVOD(vodId, elementId) {
  // Twitch Thumbnail URL
  const thumbUrl = `https://static-cdn.jtvnw.net/cf_vods/${vodId}/thumb/thumb0-640x360.jpg`;

  const img = document.getElementById(elementId);
  img.src = thumbUrl;

  // Falls Twitch das Thumbnail nicht liefert → Fallback
  img.onerror = () => {
    img.src = "img/vod-fallback.png"; // optionales Fallback-Bild
  };
}
