const target = new Date('2026-08-20T18:00:00').getTime();
const el = document.getElementById('countdown');
function update(){
  const now = Date.now();
  const d = target - now;
  if(d<=0){el.textContent='Tournament is Live!';return;}
  const days=Math.floor(d/86400000);
  const hrs=Math.floor((d%86400000)/3600000);
  const mins=Math.floor((d%3600000)/60000);
  const secs=Math.floor((d%60000)/1000);
  el.textContent=`${days}d ${hrs}h ${mins}m ${secs}s`;
}
update();
setInterval(update,1000);
