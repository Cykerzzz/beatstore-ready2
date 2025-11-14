// js/app.js
export async function loadPacks() {
  const target = document.querySelector('#cards') || document.body;
  const showErr = (msg) => {
    const pre = document.createElement('pre');
    pre.style.color = '#ff8383';
    pre.style.background = '#1b1f26';
    pre.style.padding = '12px';
    pre.style.border = '1px solid #2b3139';
    pre.style.borderRadius = '8px';
    pre.textContent = 'Erreur packs.json → ' + msg;
    target.prepend(pre);
  };

  try {
    const res = await fetch('data/packs.json?ts=' + Date.now(), {cache:'no-store'});
    if (!res.ok) {
      showErr(`HTTP ${res.status} (vérifie que data/packs.json existe)`);
      return { packs: [] };
    }
    const txt = await res.text();        // pour log clair en cas d’erreur JSON
    try {
      const json = JSON.parse(txt);
      if (!json || !Array.isArray(json.packs)) {
        showErr('format inattendu (il faut {"packs":[...]})');
        return { packs: [] };
      }
      return json;
    } catch (e) {
      showErr('JSON invalide: ' + e.message);
      console.error('packs.json content:', txt);
      return { packs: [] };
    }
  } catch (e) {
    showErr(e.message);
    return { packs: [] };
  }
}

