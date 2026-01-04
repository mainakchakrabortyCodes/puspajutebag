// layout.js

function loadHTML(elementId, filename) {
    fetch(filename)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            const el = document.getElementById(elementId);
            if (el) {
                el.innerHTML = data;

                // After header is injected, initialize header logic
                if (filename.includes('header.html')) {
                    initHeader();  // Initialize directly, no external file
                }

                // If needed in future, initialize footer or others here
            }
        })
        .catch(error => {
            console.log('Error loading ' + filename + ':', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    // Load header and footer
    loadHTML('header-placeholder', 'components/header.html');
    loadHTML('footer-placeholder', 'components/footer.html');

    // Smooth scrolling for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Animate scroll-in for .card elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.card').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Product thumbnail preview
    document.querySelectorAll('.thumbnail').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            const mainImage = document.getElementById('main-product-image');
            if (mainImage) {
                mainImage.src = this.src;
            }
        });
    });
});

// Header logic after it is injected
function initHeader() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuContent = mobileMenu?.querySelector('.mobile-menu');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mainHeader = document.getElementById('mainHeader');
    const topBar = document.getElementById('topBar');
    const menuIcon = document.getElementById('menuIcon');

    let isMenuOpen = false;
    let ticking = false;

    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                if (scrollY > 50) {
                    mainHeader?.classList.add('header-scrolled');
                    topBar?.classList.add('hide');
                } else {
                    mainHeader?.classList.remove('header-scrolled');
                    topBar?.classList.remove('hide');
                }

                ticking = false;
            });
            ticking = true;
        }
    }

    function openMobileMenu() {
        isMenuOpen = true;
        mobileMenu?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            mobileMenuContent?.classList.add('open');
        });

        if (menuIcon) menuIcon.className = 'fas fa-times text-xl';
    }

    function closeMobileMenuFn() {
        isMenuOpen = false;
        mobileMenuContent?.classList.remove('open');
        if (menuIcon) menuIcon.className = 'fas fa-bars text-xl';
        document.body.style.overflow = '';

        setTimeout(() => {
            mobileMenu?.classList.add('hidden');
        }, 300);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    mobileMenuBtn?.addEventListener('click', () => {
        isMenuOpen ? closeMobileMenuFn() : openMobileMenu();
    });

    closeMobileMenu?.addEventListener('click', closeMobileMenuFn);
    mobileOverlay?.addEventListener('click', closeMobileMenuFn);

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && isMenuOpen) {
            closeMobileMenuFn();
        }
    });

    const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    mobileDropdowns.forEach(dropdown => {
        const summary = dropdown.querySelector('summary');
        const arrow = summary?.querySelector('.mobile-arrow');

        summary?.addEventListener('click', (e) => {
            e.preventDefault();

            const isOpen = dropdown.hasAttribute('open');

            mobileDropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.removeAttribute('open');
                    const otherArrow = other.querySelector('.mobile-arrow');
                    if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
                }
            });

            if (isOpen) {
                dropdown.removeAttribute('open');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            } else {
                dropdown.setAttribute('open', '');
                if (arrow) arrow.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Smooth scroll again for anchor links (within header)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                if (isMenuOpen) {
                    closeMobileMenuFn();
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Search input
    const searchInputs = document.querySelectorAll('.search-focus');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Searching for:', this.value);
                // implement your actual search logic here
            }
        });
    });

    handleScroll(); // Trigger header state on load
}
