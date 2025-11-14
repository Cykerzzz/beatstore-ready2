// js/player.js — lecteur simple avec play/pause, seek, download + (optionnel) débit de crédits
export default class Player {
  constructor(root, samples = [], { baseUrl = "", debitCredit = false } = {}) {
    this.root = root;
    this.samples = samples;
    this.baseUrl = baseUrl;
    this.debitCredit = debitCredit;

    this.audio = new Audio();
    this.audio.preload = "metadata";
    this.audio.addEventListener("timeupdate", () => this.updateSeek());
    this.audio.addEventListener("ended", () => this.nextAuto());
    this.index = -1;

    this.render();
  }

  urlOf(s) {
    // s.file est déjà encodé dans packs.json
    // on garde tel quel et on préfixe si besoin
    return this.baseUrl ? `${this.baseUrl.replace(/\/$/,'')}/${s.file}` : s.file;
  }

  render() {
    this.root.innerHTML = "";
    this.rows = [];

    this.samples.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "row";

      const idx = document.createElement("div");
      idx.className = "idx";
      idx.textContent = String(i + 1).padStart(2, "0");

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = s.title || `Track ${i + 1}`;

      const actions = document.createElement("div");
      actions.className = "actions";

      const btn = document.createElement("button");
      btn.className = "btn play";
      btn.textContent = "Play";
      btn.addEventListener("click", () => {
        if (this.index === i && !this.audio.paused) this.pause();
        else this.playIndex(i);
      });

      const seekWrap = document.createElement("div");
      seekWrap.className = "seek";
      const tCur = document.createElement("span");
      tCur.className = "time";
      tCur.textContent = "0:00";
      const range = document.createElement("input");
      range.type = "range";
      range.min = 0; range.max = 1000; range.value = 0;
      range.addEventListener("input", () => {
        if (this.audio.duration) {
          const p = Number(range.value) / 1000;
          this.audio.currentTime = this.audio.duration * p;
        }
      });
      const tTot = document.createElement("span");
      tTot.className = "time";
      tTot.textContent = "0:00";
      seekWrap.append(tCur, range, tTot);

      const dl = document.createElement("a");
      dl.className = "dl";
      dl.textContent = "Download";
      dl.download = s.title ? `${s.title}.wav` : "";
      dl.href = this.urlOf(s);
      dl.addEventListener("click", (e) => {
        if (!this.debitCredit) return;
        // Débit 1 crédit si possible
        const key = "credits_balance";
        const cur = parseInt(localStorage.getItem(key) || "0", 10);
        if (cur <= 0) {
          e.preventDefault();
          alert("Pas assez de crédits. Va sur la page Crédits.");
        } else {
          localStorage.setItem(key, String(cur - 1));
        }
      });

      actions.append(btn, seekWrap, dl);
      row.append(idx, title, actions);
      this.root.appendChild(row);

      this.rows.push({ row, btn, range, tCur, tTot });
    });
  }

  fmt(t) {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  highlight(i) {
    this.rows.forEach((r, k) => {
      r.row.style.outline = (k === i) ? "1px solid #355" : "1px solid var(--ring)";
      r.btn.textContent = (k === i && !this.audio.paused) ? "Pause" : "Play";
    });
  }

  async playIndex(i) {
    const s = this.samples[i];
    if (!s) return;

    this.index = i;
    const u = this.urlOf(s);
    this.audio.src = u;  // IMPORTANT: on pose src à chaque fois
    try {
      await this.audio.play();
    } catch (err) {
      // iOS/Chrome peut exiger un geste utilisateur : le bouton vient d'être cliqué, donc OK.
      console.warn("play error:", err);
    }

    // Charge les métadonnées pour la durée
    this.audio.addEventListener("loadedmetadata", () => {
      const r = this.rows[i];
      if (r) r.tTot.textContent = this.fmt(this.audio.duration || 0);
    }, { once: true });

    this.highlight(i);
  }

  pause() {
    this.audio.pause();
    this.highlight(this.index);
  }

  nextAuto() {
    const n = this.index + 1;
    if (n < this.samples.length) this.playIndex(n);
  }

  updateSeek() {
    const i = this.index;
    const r = this.rows?.[i];
    if (!r) return;
    r.tCur.textContent = this.fmt(this.audio.currentTime || 0);
    if (this.audio.duration) {
      r.range.value = Math.round(1000 * (this.audio.currentTime / this.audio.duration));
    } else {
      r.range.value = 0;
    }
  }
}

