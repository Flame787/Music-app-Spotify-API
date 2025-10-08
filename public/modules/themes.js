// Themes module for changing the theme of the app:

// List of available themes:

const themes = [
  "theme0",
  "theme1",
  "theme2",
  "theme3",
  "theme4",
  "theme5",
  "theme6",
  "theme7",
  "theme8",
  "theme9",
  "theme10",
  "theme11",
  "theme12",
  "theme13",
  "theme14",
  "theme15",
];

function changeTheme(themeName) {
  const body = document.body;

  themes.forEach((theme) => {
    body.classList.remove(theme);
    document
      .querySelectorAll(".nav-button, .favorite-button, #theme_color, option")
      .forEach((el) => el.classList.remove(theme));
    document
      .querySelectorAll(
        ".remove-button, .form-theme, .title-theme, .input-color, .header-style, .thin"
      )
      .forEach((el) => el.classList.remove(theme));
  });

  body.classList.add(themeName);
  document
    .querySelectorAll(".nav-button, .favorite-button, #theme_color, option")
    .forEach((el) => el.classList.add(themeName));
  document
    .querySelectorAll(
      ".remove-button, .form-theme, .title-theme, .input-color, .header-style, .thin"
    )
    .forEach((el) => el.classList.add(themeName));
}

function saveTheme(themeName) {
  localStorage.setItem("selectedTheme", themeName);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("selectedTheme");
  const defaultTheme = themes[0];
  const themeToApply = savedTheme || defaultTheme;

  changeTheme(themeToApply);

  const selectedOption = document.querySelector(
    `.dropdown-menu li[data-value="${themeToApply}"]`
  );
  if (selectedOption) {
    document.querySelector(".dropdown-toggle").textContent =
      selectedOption.textContent;
  }
}

function setupThemeDropdown() {
  document.querySelector(".dropdown-toggle").addEventListener("click", () => {
    document.querySelector(".dropdown-menu").classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    if (
      !document.querySelector(".dropdown-toggle").contains(event.target) &&
      !document.querySelector(".dropdown-menu").contains(event.target)
    ) {
      document.querySelector(".dropdown-menu").classList.remove("show");
    }
  });

  document.querySelectorAll(".dropdown-menu li").forEach((option) => {
    option.addEventListener("click", () => {
      const themeName = option.getAttribute("data-value");
      document.querySelector(".dropdown-toggle").textContent =
        option.textContent;
      document.querySelector(".dropdown-menu").classList.remove("show");
      changeTheme(themeName);
      saveTheme(themeName);
    });
  });
}

export function setupThemeManager() {
  loadTheme();
  setupThemeDropdown();
}
