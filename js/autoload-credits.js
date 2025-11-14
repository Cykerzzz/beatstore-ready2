(()=>{
  const KEY = 'credits_balance';
  const get = ()=> parseInt(localStorage.getItem(KEY)||'0',10);
  const set = (v)=> localStorage.setItem(KEY, String(v));

  function debit(cost){
    const cur = get();
    if(cur < cost){ alert(`Pas assez de crédits (${cur})`); return false; }
    set(cur - cost);
    document.querySelectorAll('[data-credits-badge]').forEach(el=> el.textContent = get());
    return true;
  }

  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a.dl[data-cost]');
    if(!a) return;
    const cost = parseInt(a.dataset.cost||'1',10);
    if(!debit(cost)){ e.preventDefault(); e.stopPropagation(); }
  });

  // init badge at load
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('[data-credits-badge]').forEach(el=> el.textContent = get());
  });
})();