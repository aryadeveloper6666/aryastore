// Data Produk (Contoh dengan Pterodactyl Panel)
// Anda bisa mengambil ini dari API di aplikasi nyata
// js/products.js (Versi Lebih Sederhana)

const allProductsData = [
    {
        id: 1,
        name: "Hosting Panel Pterodactyl - Starter",
        description: "Solusi hosting panel Pterodactyl handal dan cepat untuk server game Anda. Termasuk instalasi otomatis.",
        price: 150000, // Harga (misal, per bulan)
        imageUrl: "images/pterodactyl-panel-hosting.png", // Ganti dengan path gambar Anda
        category: "Layanan Hosting", // Untuk pengelompokan dasar
        // OPSI TAMBAHAN (bisa diisi atau dikosongkan/dihapus jika tidak perlu):
        originalPrice: 200000, // Jika ada harga coret/diskon
        stock: 999, // Stok atau kapasitas layanan
        tags: ["pterodactyl", "hosting"], // Tag sederhana untuk pencarian (opsional)
        isPromo: true, // Tandai jika produk ini promo
        // Atribut seperti rating, reviews, timesBought, details bisa dihilangkan untuk kesederhanaan
        // Atau bisa ditambahkan secara selektif hanya untuk produk tertentu jika diperlukan.
        // Jika ini layanan, Anda bisa tambahkan satu field sederhana:
        billingCycle: "Bulanan" // Contoh untuk layanan
    },
    {
        id: 2,
        name: "Hosting Panel Pterodactyl - Pro",
        description: "Performa maksimal dengan sumber daya lebih besar dan fitur premium untuk server game Anda.",
        price: 350000,
        imageUrl: "images/pterodactyl-panel-pro.png", // Ganti dengan path gambar Anda
        category: "Layanan Hosting",
        stock: 999,
        tags: ["pterodactyl", "premium", "game server"],
        isPopular: true, // Tandai jika produk ini populer
        billingCycle: "Bulanan"
    },
    {
        id: 3,
        name: "Quantum Watch X2 (Versi Lite)",
        description: "Jam tangan pintar futuristik dengan desain elegan dan fitur esensial.",
        price: 5500000,
        imageUrl: "images/product-placeholder.jpg", // Ganti dengan gambar produk fisik
        category: "Gadget Fisik",
        originalPrice: 6000000,
        stock: 25, // Stok fisik
        tags: ["smartwatch", "gadget", "tech"],
        isPromo: true
    },
    {
        id: 4,
        name: "Basic Web Hosting",
        description: "Paket hosting web dasar untuk website personal atau portofolio Anda. Cepat dan mudah digunakan.",
        price: 50000,
        imageUrl: "images/web-hosting-basic.png", // Ganti dengan gambar Anda
        category: "Web Hosting",
        stock: 999,
        isPopular: true,
        billingCycle: "Bulanan"
    }
    // Tambahkan lebih banyak produk dengan struktur sederhana ini
];

// --- Fungsi Helper dan Generator Kartu Produk ---

// Fungsi untuk memformat harga ke Rupiah (pastikan sudah ada atau definisikan di sini/app.js)
if (typeof formatRupiah !== 'function') {
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    }
}

// Fungsi untuk membuat kartu produk HTML (Disederhanakan)
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.classList.add('product-card', 'animate-on-scroll');
    card.dataset.animation = "fadeInUp";
    card.dataset.delay = `${(index % 4) * 0.15}s`; // Staggered animation delay
    
    let badgeHtml = '';
    if (product.isPromo) {
        badgeHtml += `<span class="product-badge promo">PROMO</span>`;
    } else if (product.isPopular) { // Badge "Populer" jika tidak promo tapi populer
        badgeHtml += `<span class="product-badge popular">POPULER</span>`;
    }
    
    let priceDisplay = formatRupiah(product.price);
    if (product.billingCycle) {
        priceDisplay += ` / ${product.billingCycle}`;
    }
    
    let priceHtml = `<p class="product-price">${priceDisplay}</p>`;
    if (product.originalPrice) {
        let originalPriceDisplay = formatRupiah(product.originalPrice);
        if (product.billingCycle) { // Tambahkan billing cycle ke harga asli jika ada
            originalPriceDisplay += ` / ${product.billingCycle}`;
        }
        priceHtml = `<p class="product-price">${priceDisplay} <span class="original-price">${originalPriceDisplay}</span></p>`;
    }
    
    // Tombol Beli/Pesan Layanan
    const buttonText = product.category && product.category.toLowerCase().includes("hosting") ? "Pesan Layanan" : "Beli";
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.imageUrl || 'images/product-placeholder.jpg'}" alt="${product.name}">
            ${badgeHtml}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
            ${priceHtml}
            <div class="product-footer">
                <span class="product-category-tag">${product.category || 'Umum'}</span>
                <button class="btn btn-secondary btn-sm add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> ${buttonText}
                </button>
            </div>
        </div>
    `;
    // Menambahkan tag kategori sederhana di footer kartu
    // Jika Anda masih ingin rating, Anda bisa menambahkannya kembali di sini dengan pengecekan `if (product.rating)`
    
    return card;
}


// --- Fungsi untuk Menampilkan Produk (Sama seperti sebelumnya) ---

function displayProducts(products, containerId, limit = products.length) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    products.slice(0, limit).forEach((product, index) => {
        container.appendChild(createProductCard(product, index));
    });
    if (typeof initializeScrollAnimations === 'function') {
        initializeScrollAnimations(); // Panggil animasi scroll jika fungsi ada
    }
}

// Variabel dan fungsi untuk paginasi
let currentPage = 1;
const productsPerPage = 8; // Jumlah produk per halaman

function displayPaginatedProducts(products, containerId, page = 1) {
    const container = document.getElementById(containerId);
    // Penyesuaian selector pagination agar lebih robust
    const productSection = container ? container.closest('.product-section') : null;
    const paginationContainer = productSection ? productSection.querySelector('.pagination') : null;
    
    if (!container) return;
    
    currentPage = page;
    container.innerHTML = ''; // Bersihkan kontainer produk
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedItems = products.slice(startIndex, endIndex);
    
    paginatedItems.forEach((product, index) => {
        // Pass startIndex + index untuk menjaga konsistensi delay animasi
        container.appendChild(createProductCard(product, startIndex + index));
    });
    
    if (paginationContainer) {
        renderPagination(products.length, paginationContainer, containerId, products);
    } else if (products.length > productsPerPage) {
        // console.warn("Pagination container not found for:", containerId);
    }
    
    
    if (typeof initializeScrollAnimations === 'function') {
        initializeScrollAnimations();
    }
}

function renderPagination(totalItems, paginationContainer, gridId, productsSource) {
    paginationContainer.innerHTML = ''; // Bersihkan pagination
    const totalPages = Math.ceil(totalItems / productsPerPage);
    
    if (totalPages <= 1) return; // Tidak perlu pagination jika hanya 1 halaman atau kurang
    
    // Tombol Previous
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo; Sebelumnya';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayPaginatedProducts(productsSource, gridId, currentPage - 1);
            scrollToGrid(gridId);
        }
    });
    paginationContainer.appendChild(prevButton);
    
    // Logika untuk menampilkan tombol halaman (misal: 1 ... 3 4 5 ... 10)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
    }
    if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
    }
    
    if (startPage > 1) {
        const firstPageButton = document.createElement('button');
        firstPageButton.innerText = 1;
        firstPageButton.addEventListener('click', () => {
            displayPaginatedProducts(productsSource, gridId, 1);
            scrollToGrid(gridId);
        });
        paginationContainer.appendChild(firstPageButton);
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.innerHTML = '&hellip;';
            dots.style.margin = "0 5px";
            dots.style.color = "var(--text-color)";
            paginationContainer.appendChild(dots);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            displayPaginatedProducts(productsSource, gridId, i);
            scrollToGrid(gridId);
        });
        paginationContainer.appendChild(pageButton);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.innerHTML = '&hellip;';
            dots.style.margin = "0 5px";
            dots.style.color = "var(--text-color)";
            paginationContainer.appendChild(dots);
        }
        const lastPageButton = document.createElement('button');
        lastPageButton.innerText = totalPages;
        lastPageButton.addEventListener('click', () => {
            displayPaginatedProducts(productsSource, gridId, totalPages);
            scrollToGrid(gridId);
        });
        paginationContainer.appendChild(lastPageButton);
    }
    
    // Tombol Next
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Berikutnya &raquo;';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayPaginatedProducts(productsSource, gridId, currentPage + 1);
            scrollToGrid(gridId);
        }
    });
    paginationContainer.appendChild(nextButton);
}

function scrollToGrid(gridId) {
    const gridElement = document.getElementById(gridId);
    if (gridElement) {
        const sectionTitle = gridElement.closest('.product-section').querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Fungsi untuk mendapatkan produk berdasarkan kriteria (Disederhanakan)
function getMostBoughtProducts(limit = 4) {
    // Jika 'timesBought' tidak ada, kita bisa acak atau berdasarkan kriteria lain yang sederhana
    // Untuk contoh ini, kita ambil saja beberapa produk awal atau yang populer jika ada
    let candidates = allProductsData.filter(p => p.isPopular);
    if (candidates.length < limit) {
        candidates = candidates.concat(allProductsData.filter(p => !p.isPopular));
    }
    return candidates.slice(0, limit);
}

function getPopularProducts(limit = 4) {
    return allProductsData.filter(p => p.isPopular).slice(0, limit);
}

function getPromoProducts(limit = 4) {
    return allProductsData.filter(p => p.isPromo).slice(0, limit);
}