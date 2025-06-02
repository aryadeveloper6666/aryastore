// js/testimonials.js

document.addEventListener('DOMContentLoaded', () => {
    const testimonialGridContainer = document.getElementById('testimonial-grid-container');

    function createStarRating(rating) {
        let starsHtml = '<div class="testimonial-rating">';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        starsHtml += '</div>';
        return starsHtml;
    }

    function createTestimonialCard(testimonial, index) {
        const card = document.createElement('div');
        card.classList.add('testimonial-card-page', 'animate-on-scroll');
        card.dataset.animation = "fadeInUp"; // Atau "zoomIn", dll.
        card.dataset.delay = `${(index % 3) * 0.15}s`; // Staggered delay

        const imageHtml = `
            <div class="testimonial-card-page-image">
                <img src="${testimonial.authorImage || 'images/testimonials/default-avatar.png'}" alt="${testimonial.authorName}">
            </div>`;

        const contentHtml = `
            <div class="testimonial-card-page-content">
                ${testimonial.rating ? createStarRating(testimonial.rating) : ''}
                <p class="testimonial-text">"${testimonial.testimonialText}"</p>
                <h4 class="testimonial-author">${testimonial.authorName}</h4>
                ${testimonial.authorCompany ? `<p class="testimonial-company">${testimonial.authorCompany}</p>` : ''}
                ${testimonial.date ? `<p class="testimonial-date"><small>Diterima: ${testimonial.date}</small></p>` : ''}
            </div>`;

        card.innerHTML = imageHtml + contentHtml;
        return card;
    }

    function displayTestimonials() {
        if (!testimonialGridContainer) {
            console.warn("Elemen 'testimonial-grid-container' tidak ditemukan.");
            return;
        }
        if (typeof testimonialsData === 'undefined' || testimonialsData.length === 0) {
            testimonialGridContainer.innerHTML = '<p style="text-align:center; color: var(--text-color);">Belum ada testimoni untuk ditampilkan.</p>';
            return;
        }

        testimonialGridContainer.innerHTML = ''; // Kosongkan fallback
        testimonialsData.forEach((testimonial, index) => {
            testimonialGridContainer.appendChild(createTestimonialCard(testimonial, index));
        });

        // Inisialisasi animasi scroll jika fungsi global tersedia (dari app.js atau didefinisikan di sini)
        if (typeof initializeScrollAnimations === 'function') {
            initializeScrollAnimations();
        } else {
            // Fallback sederhana jika halaman ini diakses langsung dan app.js tidak dimuat
            const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animationType = entry.target.dataset.animation || 'fadeInUp';
                        const animationDelay = entry.target.dataset.delay || '0s';
                        entry.target.style.animationDelay = animationDelay;
                        entry.target.classList.add(animationType);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            elementsToAnimate.forEach(el => observer.observe(el));
        }
    }

    displayTestimonials();

    // Jika Anda menyertakan app.js, fungsionalitas keranjang dan mobile menu akan berfungsi.
    // Jika tidak, Anda perlu menginisiasi mobile menu di sini jika header-nya sama.
    // Contoh inisiasi mobile menu jika app.js tidak di-load:
    if (typeof initializeMobileMenu !== 'function' && document.querySelector('.menu-toggle')) { // initializeMobileMenu adalah contoh nama fungsi
        const menuToggleTestimonials = document.querySelector('.menu-toggle');
        const mainNavTestimonials = document.querySelector('.main-nav');
        if (menuToggleTestimonials && mainNavTestimonials) {
            menuToggleTestimonials.addEventListener('click', () => {
                mainNavTestimonials.classList.toggle('active');
                menuToggleTestimonials.classList.toggle('active');
            });
        }
    }

    // Logika untuk tombol keranjang di halaman testimoni (jika app.js dimuat, ini akan ditangani oleh app.js)
    // Namun, jika ID berbeda, perlu listener spesifik.
    const viewCartBtnTestimonials = document.getElementById('view-cart-btn-testimonials');
    const viewCartBtnMobileTestimonials = document.getElementById('view-cart-btn-mobile-testimonials');
    const cartModalTestimonials = document.getElementById('cart-modal'); // Asumsi ID modal sama
    const closeCartModalBtnTestimonials = cartModalTestimonials ? cartModalTestimonials.querySelector('.close-cart-modal-btn') : null;

    if (typeof renderCartSummary !== 'function') { // Hanya jika app.js tidak dimuat
        if (viewCartBtnTestimonials) {
            viewCartBtnTestimonials.addEventListener('click', (e) => {
                e.preventDefault();
                // Perlu fungsi renderCartSummary dan logika modal di sini jika app.js tidak dimuat
                alert("Fungsi keranjang belum terhubung di halaman ini.");
                // if (cartModalTestimonials) cartModalTestimonials.style.display = "block";
            });
        }
        // dan seterusnya untuk mobile & close button
    }


});