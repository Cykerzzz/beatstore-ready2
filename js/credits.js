async function loadCredits() {
  const container = document.getElementById("credits-list");
  if (!container) return;

  try {
    const res = await fetch("data/credits.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const packs = Array.isArray(data) ? data : data.packs || [];

    container.innerHTML = "";

    packs.forEach((pack) => {
      const card = document.createElement("article");
      card.className = "card";
      card.style.padding = "16px";

      const badge = document.createElement("div");
      badge.textContent = pack.badge || "Pack crédits";
      badge.style.fontSize = "11px";
      badge.style.textTransform = "uppercase";
      badge.style.opacity = "0.7";
      badge.style.marginBottom = "6px";

      const title = document.createElement("h3");
      title.textContent = pack.title;
      title.style.margin = "0 0 4px";

      const line = document.createElement("p");
      line.style.margin = "0 0 8px";
      line.style.fontSize = "14px";
      line.style.opacity = "0.85";
      line.textContent =
        pack.credits + " crédits • " + pack.price + " €";

      const desc = document.createElement("p");
      desc.style.margin = "0 0 12px";
      desc.style.fontSize = "13px";
      desc.style.opacity = "0.8";
      desc.textContent = pack.description || "";

      const btn = document.createElement("button");
      btn.textContent = "Commander ce pack";
      btn.style.padding = "8px 14px";
      btn.style.borderRadius = "999px";
      btn.style.border = "none";
      btn.style.cursor = "pointer";

      btn.onclick = () => {
        alert(
          "Pour l’instant, le paiement se fait par virement / message.\n\n" +
          "Pack : " + pack.title + " (" + pack.credits + " crédits, " + pack.price + " €)"
        );
      };

      card.appendChild(badge);
      card.appendChild(title);
      card.appendChild(line);
      card.appendChild(desc);
      card.appendChild(btn);

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erreur chargement credits.json", err);
    container.innerHTML =
      '<p style="color:#f66;font-size:14px;">Erreur de chargement des packs de crédits.</p>';
  }
}

document.addEventListener("DOMContentLoaded", loadCredits);
