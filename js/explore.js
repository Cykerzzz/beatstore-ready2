async function loadPacks() {
  try {
    const res = await fetch('data/packs.json');
    if (!res.ok) {
      throw new Error('Erreur HTTP ' + res.status);
    }

    // On récupère le tableau de packs
    const packs = await res.json();

    renderPacks(packs);
  } catch (err) {
    console.error('Erreur lors du chargement des packs :', err);
  }
}

function renderPacks(packs) {
  // Le conteneur dans ton HTML : <div id="sec-packs" class="grid cards"></div>
  const container = document.getElementById('sec-packs');
  if (!container) return;

  container.innerHTML = '';

  packs.forEach((pack) => {
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = pack.cover;
    img.alt = pack.title;

    const title = document.createElement('h3');
    title.textContent = pack.title;

    const desc = document.createElement('p');
    desc.textContent = pack.description;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);

    container.appendChild(card);
  });
}

// On lance le chargement quand la page est prête
document.addEventListener('DOMContentLoaded', loadPacks);
