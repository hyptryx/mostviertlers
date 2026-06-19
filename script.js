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
   MOSTVIERTLER SLOT MACHINE – ANIMATED
--------------------------------------------------- */

const symbols = ["🍺", "🚜", "🎧", "🔥", "😎", "💥"];

const slot1 = document.getElementById("slot1");
const slot2 = document.getElementById("slot2");
const slot3 = document.getElementById("slot3");
const result = document.getElementById("slot-result");
const btn = document.getElementById("slot-btn");

btn.addEventListener("click", () => {

  // Animation starten
  [slot1, slot2, slot3].forEach(slot => {
    slot.classList.remove("spin-active");
    void slot.offsetWidth; // Trick zum Neustarten der Animation
    slot.classList.add("spin-active");
  });

  // Zufällige Symbole
  const s1 = symbols[Math.floor(Math.random() * symbols.length)];
  const s2 = symbols[Math.floor(Math.random() * symbols.length)];
  const s3 = symbols[Math.floor(Math.random() * symbols.length)];

  // Verzögerter "Spin"
  setTimeout(() => slot1.textContent = s1, 150);
  setTimeout(() => slot2.textContent = s2, 300);
  setTimeout(() => slot3.textContent = s3, 450);

  // Ergebnis nach dem Spin
  setTimeout(() => {
    if (s1 === s2 && s2 === s3) {
      result.textContent = "🎉 JACKPOT! Du hast den goldenen Most gewonnen!";
      
      // Jackpot Flash
      [slot1, slot2, slot3].forEach(slot => {
        slot.classList.add("jackpot");
        setTimeout(() => slot.classList.remove("jackpot"), 3000);
      });

    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      result.textContent = "✨ Fast! Zwei Treffer – probier’s nochmal!";
    } else {
      result.textContent = "😅 Nix geworden… typisch Mostviertler Pech!";
    }
  }, 500);
});

/* ---------------------------------------------------
   MOSTI CATCH – HARD MODE (ENDLESS + SPEED UP)
--------------------------------------------------- */

const game = document.getElementById("catch-game");
const player = document.getElementById("catch-player");
const item = document.getElementById("catch-item");
const startBtn = document.getElementById("catch-start");
const scoreEl = document.getElementById("catch-score");
const endEl = document.getElementById("catch-end");

let score = 0;
let speed = 6;              // Startgeschwindigkeit
let speedIncrease = 0.15;   // Steigerung pro Sekunde
let fallInterval;
let speedInterval;

/* ---------------------------------------------------
   TOUCH CONTROL (nur während des Spiels aktiv)
--------------------------------------------------- */

function enableTouchControl() {
  game.addEventListener("touchmove", touchHandler, { passive: false });
}

function disableTouchControl() {
  game.removeEventListener("touchmove", touchHandler);
}

function touchHandler(e) {
  e.preventDefault();
  const rect = game.getBoundingClientRect();
  let x = e.touches[0].clientX - rect.left - 20;
  player.style.left = x + "px";
}

/* ---------------------------------------------------
   GAME START
--------------------------------------------------- */

function startGame() {
  score = 0;
  speed = 6;
  scoreEl.textContent = score;
  endEl.textContent = "";

  startBtn.disabled = true;

  // Player zentrieren
  player.style.left = (game.clientWidth / 2 - 20) + "px";

  // Item setzen
  resetItem();

  // Touch aktivieren
  enableTouchControl();

  // Geschwindigkeit steigt jede Sekunde
  speedInterval = setInterval(() => {
    speed += speedIncrease;
  }, 1000);

  // Fall-Loop
  fallInterval = setInterval(() => {
    let top = parseInt(item.style.top);
    if (isNaN(top)) top = -40;

    item.style.top = top + speed + "px";

    const itemRect = item.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Kollision
    if (
      itemRect.bottom >= playerRect.top &&
      itemRect.top <= playerRect.bottom &&
      itemRect.right >= playerRect.left &&
      itemRect.left <= playerRect.right
    ) {
      score++;
      scoreEl.textContent = score;
      resetItem();
    }

    // Verpasst → Game Over
    if (top > 300) {
      endGame();
    }

  }, 30);
}

/* ---------------------------------------------------
   ITEM RESET
--------------------------------------------------- */

function resetItem() {
  item.style.top = "-40px";
  item.style.left = Math.random() * (game.clientWidth - 40) + "px";
}

/* ---------------------------------------------------
   GAME END
--------------------------------------------------- */

function endGame() {
  clearInterval(fallInterval);
  clearInterval(speedInterval);
  startBtn.disabled = false;

  disableTouchControl();

  endEl.textContent = `💀 Game Over – Score: ${score}`;
}

/* ---------------------------------------------------
   PLAYER MOVEMENT – PC
--------------------------------------------------- */

game.addEventListener("mousemove", (e) => {
  const rect = game.getBoundingClientRect();
  let x = e.clientX - rect.left - 20;
  player.style.left = x + "px";
});

/* ---------------------------------------------------
   START BUTTON
--------------------------------------------------- */

startBtn.addEventListener("click", startGame);


