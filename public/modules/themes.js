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

// Function for changing the theme: 
function changeTheme(themeName) {
  const body = document.body;

  // Remove all existing theme classes:
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

  // Add the newly selected theme style:
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

// Function to save the selected theme to localStorage:
function saveTheme(themeName) {
  localStorage.setItem("selectedTheme", themeName);
}

// Function to load the saved theme from localStorage (or default theme):
function loadTheme() {
  const savedTheme = localStorage.getItem("selectedTheme");
  const defaultTheme = themes[0];
  const themeToUse = savedTheme || defaultTheme;

  changeTheme(themeToUse);

  const selectedOption = document.querySelector(
    `.dropdown-menu li[data-value="${themeToUse}"]`
  );
  if (selectedOption) {
    document.querySelector(".dropdown-toggle").textContent =
      selectedOption.textContent;
  }
}

// Dropwown menu for theme-picking: 
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

// Export/ Initialize the theme manager:
export function setupThemeManager() {
  loadTheme();
  setupThemeDropdown();
}
