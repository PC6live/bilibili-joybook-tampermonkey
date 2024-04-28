export function removeTips() {
  window.addEventListener("DOMContentLoaded",() => {
    const tips = document.querySelector(".adblock-tips");
    tips?.parentElement?.removeChild(tips);
  })
}
