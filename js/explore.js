// js/explore.js
(async function () {
  const grid = document.querySelector(".grid.cards, .cats") || document.body;
  let data;
  try {
    const res = await fetch("data/packs.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    console.error("packs.json introuvable", e);
    return;
  }
  function coverFor(id){
    return new Promise((resolve)=>{
      const jpg = new Image();
      jpg.onload = ()=>resolve(`assets/img/cover-${id}.jpg`);
      jpg.onerror = ()=>{
        const png = new Image();
        png.onload = ()=>resolve(`assets/img/cover-${id}.png`);
        png.onerror = ()=>resolve("assets/img/cover-default.jpg");
        png.src = `assets/img/cover-${id}.png`;
      };
      jpg.src = `assets/img/cover-${id}.jpg`;
    });
  }
  async function card(pack){
    const a=document.createElement("a");
    a.href=`category.html?id=${encodeURIComponent(pack.id)}`;
    a.className="card";
    const lbl=document.createElement("div");
    lbl.className="label"; lbl.textContent=(pack.genre||pack.title||"").toUpperCase();
    const h4=document.createElement("h4"); h4.textContent=pack.title||pack.id;
    const sm=document.createElement("small"); sm.textContent=`${(pack.samples||[]).length} beats`;
    const img=document.createElement("img"); img.className="thumb"; img.alt=`${pack.id} cover`;
    img.src="assets/img/cover-default.jpg"; coverFor(pack.id).then(src=>img.src=src);
    a.append(lbl,img,h4,sm);
    return a;
  }
  grid.innerHTML="";
  for(const p of (data.packs||[])){ grid.appendChild(await card(p)); }
  console.log("Explore OK:", (data.packs||[]).length);
})();
