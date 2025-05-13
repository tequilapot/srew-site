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
                    }
                } catch (error) {
                    // Silent error handling
                }
            } else if (hrefValue === '#') {
                e.preventDefault();
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

    // --- Dynamic Copyright Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    const currentYearContactSpan = document.getElementById('currentYearContact');
    if (currentYearContactSpan) {
        currentYearContactSpan.textContent = new Date().getFullYear();
    }
});