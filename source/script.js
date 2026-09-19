document.addEventListener("DOMContentLoaded", () => {
  const mode = document.body.dataset.mode || "static build";
  const badge = document.getElementById("mode");
  if (badge) badge.textContent = mode;
});
