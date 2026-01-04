document.addEventListener('DOMContentLoaded', () => {
    // Check if running on file protocol
    if (window.location.protocol === 'file:') {
        console.error('CRITICAL ERROR: distinct header/footer files cannot be loaded via "file://" protocol due to browser security restrictions (CORS). You MUST use a local server (e.g., "python3 -m http.server").');
        alert('Notice: Header and Footer cannot load when opening files directly due to browser security. Please run this project on a local server. See the Walkthrough for instructions.');
    }

    // Load Header
    fetch('header.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;

            // Mobile Menu Toggle
            const menuToggle = document.querySelector('.menu-toggle');
            const navMenu = document.querySelector('.nav-menu');

            if (menuToggle && navMenu) {
                menuToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                });
            }
        })
        .catch(error => console.error('Error loading header:', error));

    // Load Footer
    fetch('footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
    // Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
