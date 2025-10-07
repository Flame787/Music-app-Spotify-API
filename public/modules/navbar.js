// Navbar behavior:
export function setupNavbar() {
  let prevScrollPos = window.scrollY;
  const navbar = document.getElementById("navigation");

  // get navbar height (it varies depending on resolution):
  function getNavbarHeight() {
    return navbar.offsetHeight;
  }

  window.onscroll = function () {
    let currentScrollPos = window.scrollY;

    if (prevScrollPos > currentScrollPos) {
      //  If scrolling up, show navbar:
      navbar.style.top = "0";
    } else {
      // If scrolling down, hide navbar:
      navbar.style.top = `-${getNavbarHeight()}px`; // Navbar height in pixel - adjustable
    }

    prevScrollPos = currentScrollPos;
  };

  // Show navbar when hovered over with mouse:
  navbar.addEventListener("mouseenter", () => {
    navbar.style.top = "0";
  });

  // Hide navbar when mouse leaves navbar area and user scrolls down:
  navbar.addEventListener("mouseleave", () => {
    let currentScrollPos = window.scrollY;
    if (prevScrollPos < currentScrollPos) {
      navbar.style.top = `-${getNavbarHeight()}px`;
    }
  });
}
