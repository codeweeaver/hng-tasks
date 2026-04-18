const timeEl = document.getElementById("user-time");

function tick() {
  timeEl.textContent = Date.now();
}

tick();
setInterval(tick, 1000);
