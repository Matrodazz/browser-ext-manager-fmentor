document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const button = document.getElementById("theme__toggle");
  const icon = document.getElementById("theme__icon");

  // alternar tema claro/escuro
  if (button && icon) {
    button.addEventListener("click", () => {
      const isDark = body.getAttribute("data-theme") === "dark";
      body.setAttribute("data-theme", isDark ? "light" : "dark");
      icon.src = isDark ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg";
    });
  }
});