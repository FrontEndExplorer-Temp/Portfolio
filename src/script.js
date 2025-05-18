document.addEventListener("DOMContentLoaded", () => {
  const openMenuBtn = document.querySelector(".open-menu");
  const mobileMenu = document.querySelector(".mobile-menu");

  openMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.querySelector(".theme-toggle");
  const html = document.documentElement;

  // Load stored theme from localStorage
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    html.classList.remove("theme-blue", "theme-dark", "theme-purple");
    html.classList.add(storedTheme);
  }

  // Toggle between blue and dark on click
  themeToggleBtn.addEventListener("click", () => {
    const isDark = html.classList.contains("theme-dark");
    const newTheme = isDark ? "theme-blue" : "theme-dark";

    html.classList.remove("theme-blue", "theme-dark", "theme-purple");
    html.classList.add(newTheme);

    // Save to localStorage
    localStorage.setItem("theme", newTheme);
  });
});
