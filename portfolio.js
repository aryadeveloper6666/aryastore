document.addEventListener('DOMContentLoaded', () => {
    const portfolioItemsData = [
        {
            id: 1,
            title: "Website E-commerce Futuristik",
            category: "web-design",
            imageUrl: "images/portfolio-item1.jpg",
            description: "Platform belanja online dengan UX mutakhir, integrasi AI untuk rekomendasi, dan desain responsif.",
            link: "#"
        },
        {
            id: 2,
            title: "Aplikasi Mobile Produktivitas Cerdas",
            category: "app-dev",
            imageUrl: "images/portfolio-item2.jpg",
            description: "Aplikasi mobile lintas platform yang membantu pengguna mengatur tugas dan waktu dengan bantuan AI.",
            link: "#"
        },
        {
            id: 3,
            title: "Branding Korporat Perusahaan Teknologi",
            category: "branding",
            imageUrl: "images/portfolio-item3.jpg",
            description: "Pengembangan identitas visual yang kuat dan modern, mencerminkan inovasi dan masa depan.",
            link: "#"
        },
        {
            id: 4,
            title: "Solusi Hosting Panel Pterodactyl Kustom",
            category: "hosting-solution",
            imageUrl: "images/pterodactyl-panel-hosting.png", // Gunakan gambar yang relevan
            description: "Menyediakan dan mengkonfigurasi panel Pterodactyl yang dioptimalkan untuk berbagai server game dengan uptime tinggi.",
            link: "#"
        },
        {
            id: 5,
            title: "Desain UI/UX Aplikasi Kesehatan Holistik",
            category: "web-design",
            imageUrl: "images/product-placeholder.jpg", // Ganti gambar
            description: "Antarmuka pengguna yang intuitif dan menenangkan untuk aplikasi pemantauan kesehatan dan gaya hidup.",
            link: "#"
        },
        {
            id: 6,
            title: "Pengembangan Sistem Manajemen Server Game",
            category: "app-dev",
            imageUrl: "images/product-placeholder.jpg", // Ganti gambar
            description: "Aplikasi web kustom untuk administrasi dan monitoring multi-server game secara efisien.",
            link: "#"
        }
    ];

    const portfolioGrid = document.getElementById('portfolio-grid-container');
    const filterButtons = document.querySelectorAll('.portfolio-filters .filter-btn');

    function createPortfolioItemCard(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('portfolio-item', 'animate-on-scroll');
        itemDiv.dataset.category = item.category;
        itemDiv.dataset.animation = "zoomIn";
        itemDiv.dataset.delay = `${(index % 3) * 0.15}s`;

        itemDiv.innerHTML = `
            <img src="${item.imageUrl || 'images/product-placeholder.jpg'}" alt="${item.title}">
            <div class="portfolio-item-overlay">
                <h3>${item.title}</h3>
                <p>${item.description.substring(0,80)}...</p>
                <a href="${item.link}" class="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">Lihat Detail</a>
            </div>
        `;
        return itemDiv;
    }

    function displayPortfolioItems(items) {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = '';
        items.forEach((item, index) => {
            portfolioGrid.appendChild(createPortfolioItemCard(item, index));
        });
        if (typeof initializeScrollAnimations === 'function') {
            initializeScrollAnimations();
        } else {
            // Fallback sederhana jika halaman ini diakses langsung
            const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const animationType = entry.target.dataset.animation || 'fadeIn';
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

    if (portfolioGrid) { // Hanya jalankan jika grid ada
        displayPortfolioItems(portfolioItemsData);
    }


    if (filterButtons.length > 0 && portfolioGrid) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.dataset.filter;
                const filteredItems = portfolioItemsData.filter(item => {
                    if (filterValue === 'all') return true;
                    return item.category === filterValue;
                });
                displayPortfolioItems(filteredItems);
            });
        });
    }

    // --- Testimonial Slider ---
    const slider = document.querySelector('.testimonial-slider');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    let testimonials; // Akan diisi setelah slider ada

    if (slider) {
        testimonials = slider.querySelectorAll('.testimonial');
        let currentIndex = 0;

        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.remove('active');
                if (i === index) {
                    testimonial.classList.add('active');
                }
            });
        }

        if (testimonials.length > 0) {
            showTestimonial(currentIndex); // Tampilkan yang pertama

            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % testimonials.length;
                    showTestimonial(currentIndex);
                });
            }
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                    showTestimonial(currentIndex);
                });
            }

            // Auto slide (opsional)
            setInterval(() => {
                if (document.hidden) return; // Jangan slide jika tab tidak aktif
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            }, 7000); // Ganti slide setiap 7 detik

        } else if (prevButton && nextButton) { // Sembunyikan tombol jika tidak ada testimoni
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
    }


    // Smooth scroll untuk nav link di halaman portofolio
    const portfolioNavLinks = document.querySelectorAll('.main-nav a.nav-link[href^="#"]');
    portfolioNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Penyesuaian untuk header fixed
                    behavior: 'smooth'
                });
            }
        });
    });


});