(()=>{
  const KEY = 'credits_balance';
  const get = ()=> parseInt(localStorage.getItem(KEY)||'0',10);
  const set = (v)=> localStorage.setItem(KEY, String(v));

  const $balance = document.getElementById('balance');
  function render(){
    const v = get();
    if($balance) $balance.textContent = v;
    document.querySelectorAll('[data-credits-badge]').forEach(el=> el.textContent = v);
  }
  function add(n){ set(get()+n); render(); }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('button.offer[data-add]'); if(!btn) return;
    const n = parseInt(btn.dataset.add||'0',10); if(!Number.isFinite(n)) return;
    add(n);
  });

  document.addEventListener('DOMContentLoaded', render);
})();