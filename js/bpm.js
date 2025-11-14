(function(){
  let last=0, intervals=[], bpm=0;
  const box = document.createElement('div');
  box.id='bpmBox';
  box.innerHTML = `<h4>BPM</h4>
    <div>Tap: <button id="bpmTap" class="btn">TAP</button></div>
    <div>Estimation: <span id="bpmValue">—</span></div>
    <div><button id="bpmReset" class="btn">Reset</button></div>`;
  document.addEventListener('DOMContentLoaded', ()=>{
    document.body.appendChild(box);
    document.getElementById('bpmTap').addEventListener('click', ()=>{
      const now = performance.now();
      if(last>0){
        intervals.push(now-last);
        if(intervals.length>8) intervals.shift();
        const avg = intervals.reduce((a,b)=>a+b,0)/(intervals.length||1);
        bpm = Math.round(60000/avg);
        document.getElementById('bpmValue').textContent = bpm>0? bpm : '—';
      }
      last = now;
    });
    document.getElementById('bpmReset').addEventListener('click', ()=>{
      last = 0; intervals = []; bpm = 0;
      document.getElementById('bpmValue').textContent = '—';
    });
  });
})();
