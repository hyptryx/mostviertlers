/* ---------------------------------------------------
   FIREBASE INIT – GLOBAL HIGHSCORES
--------------------------------------------------- */
const firebaseConfig = {
  apiKey: "AIzaSyAhdTxRsm0qNUTw-iN8AHJI5ZYSA2m9oII",
  authDomain: "mosti-catch.firebaseapp.com",
  databaseURL: "https://mosti-catch-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mosti-catch",
  storageBucket: "mosti-catch.appspot.com",
  messagingSenderId: "100463668785",
  appId: "1:100463668785:web:3e4bb19ea88a99905d6f10"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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

// Name-Eingabe anzeigen
document.getElementById("catch-name-input").style.display = "block";

// Speichern-Button aktivieren
document.getElementById("catch-save-name").onclick = () => {
  const name = document.getElementById("catch-player-name").value.trim() || "Unbekannt";

  saveHighscore(name, score);
  renderHighscores();

  // Eingabefeld wieder verstecken
  document.getElementById("catch-name-input").style.display = "none";
  document.getElementById("catch-player-name").value = "";
};

}

/* ---------------------------------------------------
   MOSTI RUN – UPGRADED ARCADE VERSION
--------------------------------------------------- */

const runGame = document.getElementById("run-game");
const runPlayer = document.getElementById("run-player");
const runStartBtn = document.getElementById("run-start");
const runScoreEl = document.getElementById("run-score");
const runEndEl = document.getElementById("run-end");
const runNameInput = document.getElementById("run-name-input");
const runObstacles = document.getElementById("run-obstacles");

let runScore = 0;
let runSpeed = 6;
let runGameActive = false;
let runIsJumping = false;
let runInterval;
let runSpeedInterval;

/* ---------------------------------------------------
   SOUNDS
--------------------------------------------------- */
const sndJump = new Audio("sounds/jump.mp3");
const sndCrash = new Audio("sounds/crash.mp3");

/* ---------------------------------------------------
   JUMP (Mario‑Style)
--------------------------------------------------- */
function runJump() {
  if (!runGameActive || runIsJumping) return;

  sndJump.currentTime = 0;
  sndJump.play();

  runIsJumping = true;
  runPlayer.classList.add("jump");

  setTimeout(() => {
    runPlayer.classList.remove("jump");
    runIsJumping = false;
  }, 550);
}

/* Sofort‑Jump */
runGame.addEventListener("mousedown", runJump);
runGame.addEventListener("touchstart", runJump);
document.addEventListener("keydown", e => {
  if (e.code === "Space") runJump();
});

/* ---------------------------------------------------
   OBSTACLE SPAWN (PNG + Random Size)
--------------------------------------------------- */
function spawnObstacle() {
  const box = document.createElement("img");
  box.src = "img/bierkiste.png";
  box.classList.add("run-obstacle");

  const sizes = [40, 55, 70];   // kleinere Kisten
  const size = sizes[Math.floor(Math.random() * sizes.length)];
  box.style.width = size + "px";

  const heights = [20, 40, 60]; // weniger extreme Höhen
  const h = heights[Math.floor(Math.random() * heights.length)];
  box.style.bottom = h + "px";

  box.style.animationDuration = (3.5 - runSpeed * 0.05) + "s";

  runObstacles.appendChild(box);

  setTimeout(() => box.remove(), 4000);
}

/* ---------------------------------------------------
   COLLISION CHECK
--------------------------------------------------- */
function checkCollision() {
  const playerRect = runPlayer.getBoundingClientRect();

  document.querySelectorAll(".run-obstacle").forEach(ob => {
    const obRect = ob.getBoundingClientRect();

    if (
      obRect.left < playerRect.right &&
      obRect.right > playerRect.left &&
      obRect.bottom > playerRect.top &&
      obRect.top < playerRect.bottom
    ) {
      runGameOver();
    }
  });
}

/* ---------------------------------------------------
   ANTI‑CHEAT (Teleport‑Blocker)
--------------------------------------------------- */
setInterval(() => {
  if (!runGameActive) return;

  const bottom = parseInt(window.getComputedStyle(runPlayer).bottom);
  if (bottom > 200) {
    runGameOver();
  }
}, 200);

/* ---------------------------------------------------
   GAME START
--------------------------------------------------- */
function runStartGame() {
  runScore = 0;
  runSpeed = 6;
  runGameActive = true;

  runScoreEl.textContent = "0";
  runEndEl.textContent = "";
  runNameInput.style.display = "none";

  runStartBtn.disabled = true;

  /* Speed‑Kurve wie Chrome Dino */
  runSpeedInterval = setInterval(() => {
    runSpeed += 0.05 + runScore * 0.0008;
  }, 1000);

  /* Score + Obstacles */
  runInterval = setInterval(() => {
    runScore++;
    runScoreEl.textContent = runScore;

    if (runScore % 40 === 0) spawnObstacle();

    checkCollision();
  }, 100);
}

/* ---------------------------------------------------
   GAME OVER
--------------------------------------------------- */
function runGameOver() {
  if (!runGameActive) return;

  runGameActive = false;

  clearInterval(runInterval);
  clearInterval(runSpeedInterval);

  sndCrash.currentTime = 0;
  sndCrash.play();

  runEndEl.textContent = `💀 Game Over – Überlebt: ${runScore} Sekunden`;

  runNameInput.style.display = "block";

  document.getElementById("run-save-name").onclick = () => {
    const name = document.getElementById("run-player-name").value.trim() || "Unbekannt";

    saveRunHighscore(name, runScore);
    renderRunHighscores();

    /* Neuer Rekord Flash */
    runEndEl.classList.add("new-record");
    setTimeout(() => runEndEl.classList.remove("new-record"), 3000);

    runNameInput.style.display = "none";
    document.getElementById("run-player-name").value = "";
  };

  runStartBtn.disabled = false;
}

/* ---------------------------------------------------
   FIREBASE – MOSTI RUN HIGHSCORES
--------------------------------------------------- */
function saveRunHighscore(name, score) {
  const ref = db.ref("mostiRunHighscores");

  const cleanName = name.trim();
  const keyName = cleanName.toLowerCase();

  ref.orderByChild("keyName").equalTo(keyName).once("value", snapshot => {

    if (snapshot.exists()) {
      const key = Object.keys(snapshot.val())[0];
      const oldData = snapshot.val()[key];

      if (score > oldData.score) {
        ref.child(key).update({
          name: cleanName,
          keyName: keyName,
          score,
          timestamp: Date.now()
        });
      }

    } else {
      ref.push({
        name: cleanName,
        keyName: keyName,
        score,
        timestamp: Date.now()
      });
    }
  });
}

function renderRunHighscores() {
  const list = document.getElementById("run-highscore-list");
  list.innerHTML = "";

  db.ref("mostiRunHighscores")
    .orderByChild("score")
    .limitToLast(5)
    .on("value", snapshot => {
      const entries = [];

      snapshot.forEach(child => entries.push(child.val()));

      entries.sort((a, b) => b.score - a.score);

      list.innerHTML = "";

      entries.forEach((entry, i) => {
        const li = document.createElement("li");
        li.textContent = `${i + 1}. ${entry.name} – ${entry.score} Sekunden`;
        list.appendChild(li);
      });
    });
}

/* ---------------------------------------------------
   START BUTTON
--------------------------------------------------- */
runStartBtn.addEventListener("click", runStartGame);

renderRunHighscores();

/* ---------------------------------------------------
   GLOBAL HIGHSCORES (FIREBASE)
--------------------------------------------------- */

// Score in Firebase speichern (mit "ein Spieler = ein Eintrag")
function saveHighscore(name, score) {
  const ref = db.ref("mostiCatchHighscores");

  // Name normal anzeigen, aber intern klein speichern
  const cleanName = name.trim();
  const keyName = cleanName.toLowerCase();

  // 1. Prüfen, ob der Name bereits existiert (in lowercase)
  ref.orderByChild("keyName").equalTo(keyName).once("value", snapshot => {

    if (snapshot.exists()) {
      // Spieler existiert → alten Score holen
      const key = Object.keys(snapshot.val())[0];
      const oldData = snapshot.val()[key];

      // 2. Nur überschreiben, wenn neuer Score besser ist
      if (score > oldData.score) {
        ref.child(key).update({
          name: cleanName,   // Anzeige-Name
          keyName: keyName,  // Vergleichs-Name
          score,
          timestamp: Date.now()
        });
      }

    } else {
      // Spieler existiert NICHT → neuen Eintrag anlegen
      ref.push({
        name: cleanName,     // Anzeige-Name
        keyName: keyName,    // Vergleichs-Name
        score,
        timestamp: Date.now()
      });
    }
  });
}

// Highscores aus Firebase laden (LIVE)
function renderHighscores() {
  const list = document.getElementById("catch-highscore-list");
  list.innerHTML = "";

  db.ref("mostiCatchHighscores")
    .orderByChild("score")
    .limitToLast(5)
    .on("value", snapshot => {
      const entries = [];

      snapshot.forEach(child => {
        entries.push(child.val());
      });

      // höchste zuerst
      entries.sort((a, b) => b.score - a.score);

      list.innerHTML = "";

      entries.forEach((entry, i) => {
        const li = document.createElement("li");
        li.textContent = `${i + 1}. ${entry.name} – ${entry.score} Punkte`;
        list.appendChild(li);
      });
    });
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

renderHighscores();

