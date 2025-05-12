// js/main.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("Main.js: DOMContentLoaded fired.");

    // --- Smooth scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const hrefValue = this.getAttribute('href');
            if (hrefValue && hrefValue !== '#') {
                const targetId = hrefValue;
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const navbarHeight = document.querySelector('.navbar.fixed-top')?.offsetHeight || 70;
                        window.scrollTo({
                            top: targetElement.offsetTop - navbarHeight,
                            behavior: 'smooth'
                        });
                        // console.log("Smooth scrolling to:", targetId);
                    } else {
                        // console.warn("Smooth scroll target not found:", targetId);
                    }
                } catch (error) {
                    // console.warn("Smooth scroll error for selector:", targetId, error);
                }
            } else if (hrefValue === '#') {
                e.preventDefault();
                // console.log("Smooth scroll: Link is just '#', preventing default.");
            }
        });
    });

    // --- Add active class to current nav item ---
    const currentLocation = window.location.href;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    let homeLinkActive = true;

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.href;
        if (linkHref === currentLocation) {
            link.classList.add('active');
            homeLinkActive = false;
        } else if (currentLocation.endsWith('/') && link.getAttribute('href') === 'index.html' && homeLinkActive) {
            link.classList.add('active');
            homeLinkActive = false;
        }
    });
    if (homeLinkActive && (currentLocation.endsWith('/index.html') || currentLocation.endsWith('/'))) {
        const homeNavLink = document.querySelector('.navbar-nav .nav-link[href="index.html"]');
        if (homeNavLink) {
            homeNavLink.classList.add('active');
        }
    }
    // console.log("Active nav link logic applied. Current location:", currentLocation);


    // --- Dynamic Copyright Year ---
    // Ensure unique IDs if needed, or use a class if multiple elements need this.
    const currentYearSpan = document.getElementById('currentYear'); // For index.html footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
        // console.log("Copyright year updated for 'currentYear'.");
    }
    const currentYearContactSpan = document.getElementById('currentYearContact'); // For contact.html footer
    if (currentYearContactSpan) {
        currentYearContactSpan.textContent = new Date().getFullYear();
        // console.log("Copyright year updated for 'currentYearContact'.");
    }
});