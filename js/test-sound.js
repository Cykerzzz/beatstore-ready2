// js/test-sound.js

const BTN = document.getElementById("test-sound-btn");
const PLAYER = document.getElementById("test-sound-player");

// Chemin vers TON son (à adapter) :
const TEST_SOUND_URL = "assets/audio/monson.mp3";
// Par exemple : "assets/loops/mon-beat.mp3" ou "assets/tracks/monbeat.wav"

if (BTN && PLAYER) {
  BTN.addEventListener("click", async () => {
    BTN.disabled = true;
    BTN.textContent = "Chargement...";

    try {
      const res = await fetch(TEST_SOUND_URL);

      if (!res.ok) {
        throw new Error("Impossible de charger le son : " + res.status);
      }

      // On récupère le fichier en blob (pratique pour l'audio)
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      PLAYER.src = url;
      await PLAYER.play();

      BTN.textContent = "▶ Rejouer le son";
    } catch (err) {
      console.error(err);
      BTN.textContent = "Erreur de chargement 😕";
    } finally {
      BTN.disabled = false;
    }
  });
}

