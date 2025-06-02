document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Durasi preloader bisa disesuaikan atau dihubungkan dengan event window.onload
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 1500); // Contoh durasi 1.5 detik
    }

    // --- Smooth Scroll & Active Nav Link ---
    const navLinks = document.querySelectorAll('.main-nav a.nav-link');
    const sections = document.querySelectorAll('main section[id]'); // Hanya untuk #link di halaman yang sama

    function setActiveLink() {
        let currentHash = "";
        if (window.location.hash) {
            currentHash = window.location.hash;
        } else {
            // Jika tidak ada hash, coba deteksi section yang terlihat
            let currentSectionId = 'home'; // Default ke home
            let maxVisibleArea = 0;

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                // Cek apakah section ada di viewport
                const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
                const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
                const visibleArea = visibleHeight * visibleWidth;

                if (visibleArea > maxVisibleArea && rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    maxVisibleArea = visibleArea;
                    currentSectionId = section.getAttribute('id');
                }
            });
            currentHash = `#${currentSectionId}`;
        }


        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            const linkPage = linkHref.split('#')[0]; // Halaman target dari link
            const currentPage = window.location.pathname.split("/").pop() || "index.html"; // Halaman saat ini

            // Jika link adalah hash dan di halaman yang sama
            if (linkHref.startsWith('#') && (currentPage === "index.html" || currentPage === "")) {
                if (linkHref === currentHash) {
                    link.classList.add('active');
                }
            }
            // Jika link adalah halaman lain
            else if (linkPage === currentPage) {
                 link.classList.add('active');
                 // Jika ada hash di link halaman lain dan itu cocok dengan hash URL saat ini
                 if (linkHref.includes('#') && linkHref.split('#')[1] === window.location.hash.substring(1)) {
                    link.classList.add('active');
                 } else if (!linkHref.includes('#') && !window.location.hash && linkPage === currentPage){
                    link.classList.add('active'); // Aktif jika hanya nama halaman cocok dan tidak ada hash
                 }
            }
        });
    }


    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref.startsWith('#')) { // Hanya untuk internal page links
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Penyesuaian untuk header fixed
                        behavior: 'smooth'
                    });
                    // Update hash di URL tanpa reload halaman (opsional)
                    // history.pushState(null, null, targetId);
                    // setActiveLink(); // Langsung set active setelah klik
                }
                // Tutup menu mobile jika terbuka
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                }
            });
        }
    });

    window.addEventListener('scroll', setActiveLink);
    window.addEventListener('hashchange', setActiveLink); // Update saat hash URL berubah
    setActiveLink(); // Panggil saat load awal


    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active'); // Untuk mengubah ikon hamburger menjadi X
        });
    }

    // --- Animasi Scroll Global ---
    // Pastikan fungsi ini dipanggil setelah elemen dimuat, terutama produk
    window.initializeScrollAnimations = () => {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationType = entry.target.dataset.animation || 'fadeInUp'; // Default ke fadeInUp jika tidak diset
                    const animationDelay = entry.target.dataset.delay || '0s';
                    entry.target.style.animationDelay = animationDelay;
                    entry.target.classList.add(animationType); // Memicu animasi dari animations.css
                    observer.unobserve(entry.target); // Hentikan observasi setelah animasi
                }
            });
        }, { threshold: 0.1 }); // Munculkan saat 10% elemen terlihat

        elementsToAnimate.forEach(el => observer.observe(el));
    };
    // Panggil setelah DOM siap, dan panggil lagi setelah produk dimuat jika produk dimuat secara dinamis
    initializeScrollAnimations();


    // --- Variabel Global untuk Modal dan Keranjang ---
    const cartModal = document.getElementById('cart-modal');
    const viewCartBtn = document.getElementById('view-cart-btn'); // Tombol keranjang di header desktop
    const viewCartBtnMobile = document.getElementById('view-cart-btn-mobile'); // Tombol keranjang di header mobile
    const viewCartBtnTestimonials = document.getElementById('view-cart-btn-testimonials'); // Tombol di halaman testimoni
    const viewCartBtnMobileTestimonials = document.getElementById('view-cart-btn-mobile-testimonials'); // Tombol di halaman testimoni mobile

    const closeCartModalBtn = cartModal ? cartModal.querySelector('.close-cart-modal-btn') : null;
    const cartSummaryContainer = document.getElementById('cart-summary-container'); // Untuk index.html
    const cartSummaryContainerTestimonials = document.getElementById('cart-summary-container-testimonials'); // Untuk testimonials.html
    const cartModalFooterActions = document.getElementById('cart-modal-footer-actions'); // Untuk index.html
    const cartModalFooterActionsTestimonials = document.getElementById('cart-modal-footer-actions-testimonials'); // Untuk testimonials.html

    const cartItemCountBadge = document.querySelector('.cart-item-count-badge'); // Badge di header desktop
    const cartItemCountBadgeMobile = document.querySelector('.cart-item-count-badge-mobile'); // Badge di header mobile

    const YOUR_WHATSAPP_NUMBER = "6287743690976"; // GANTI DENGAN NOMOR WHATSAPP ANDA (format internasional tanpa + atau 0)

    // --- Inisialisasi Keranjang Belanja ---
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Fungsi format Rupiah (jika tidak ada di products.js atau untuk konsistensi)
    function formatRupiahApp(angka) {
        if (typeof formatRupiah === 'function' && formatRupiah !== formatRupiahApp) { // Cek apakah ada versi global dari products.js
            return formatRupiah(angka); // Gunakan versi global jika ada
        }
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    }


    function updateCartItemCount() {
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const badges = [cartItemCountBadge, cartItemCountBadgeMobile];

        badges.forEach(badge => {
            if (badge) {
                badge.textContent = totalQuantity;
                badge.style.display = totalQuantity > 0 ? 'inline-block' : 'none';
                if (totalQuantity > 0) { // Animasi kecil saat update
                    badge.style.transform = 'scale(1.2)';
                    setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
                }
            }
        });
    }

    function renderCartSummary() {
        // Tentukan kontainer mana yang aktif berdasarkan halaman saat ini
        const currentCartSummaryContainer = cartSummaryContainerTestimonials || cartSummaryContainer;
        const currentCartModalFooterActions = cartModalFooterActionsTestimonials || cartModalFooterActions;

        if (!currentCartSummaryContainer || !currentCartModalFooterActions) {
            // console.warn("Elemen modal keranjang tidak ditemukan di halaman ini.");
            return;
        }

        currentCartSummaryContainer.innerHTML = ''; // Kosongkan kontainer
        currentCartModalFooterActions.innerHTML = ''; // Kosongkan footer

        if (cart.length === 0) {
            currentCartSummaryContainer.innerHTML = '<p class="empty-cart-message">Keranjang Anda masih kosong. <br>Ayo mulai belanja!</p>';
            updateCartItemCount();
            return;
        }

        let grandTotal = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-summary-item');
            const itemSubtotal = item.price * item.quantity;
            grandTotal += itemSubtotal;

            let priceString = formatRupiahApp(item.price);
            if (item.billingCycle) {
                priceString += ` / ${item.billingCycle}`;
            }

            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.imageUrl || 'images/product-placeholder.jpg'}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Harga: ${priceString}</p>
                    <div class="cart-item-quantity-controls">
                        <button class="quantity-btn decrease-qty-btn" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="item-quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-qty-btn" data-id="${item.id}" ${item.stock !== undefined && item.quantity >= item.stock ? 'disabled' : ''}>+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <p class="price">${formatRupiahApp(itemSubtotal)}</p>
                    <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Hapus</button>
                </div>
            `;
            currentCartSummaryContainer.appendChild(itemElement);
        });

        // Tambahkan Total Keseluruhan
        const totalElement = document.createElement('div');
        totalElement.classList.add('cart-total-summary');
        totalElement.innerHTML = `<h3>Total: <span>${formatRupiahApp(grandTotal)}</span></h3>`;
        currentCartSummaryContainer.appendChild(totalElement);

        // Tambahkan Tombol Aksi di Footer Modal
        currentCartModalFooterActions.innerHTML = `
            <button class="btn btn-secondary btn-sm" id="clear-cart-btn">Kosongkan Keranjang</button>
            <button class="btn btn-primary btn-sm" id="checkout-whatsapp-btn">Konfirmasi via WhatsApp</button>
            <button class="btn btn-primary btn-sm" id="checkout-payment-page-btn">Lanjut ke Pembayaran</button>
        `;

        addCartActionListeners(); // Tambahkan event listener untuk tombol aksi baru
        updateCartItemCount();
    }

    function addCartActionListeners() {
        // Tombol Lanjut ke Pembayaran (payment.html)
        const checkoutPaymentPageBtn = document.getElementById('checkout-payment-page-btn');
        if (checkoutPaymentPageBtn) {
            checkoutPaymentPageBtn.addEventListener('click', () => {
                localStorage.setItem('cartTotal', cart.reduce((sum, item) => sum + (item.price * item.quantity), 0));
                window.location.href = 'payment.html';
            });
        }

        // Tombol Konfirmasi via WhatsApp
        const checkoutWhatsAppBtn = document.getElementById('checkout-whatsapp-btn');
        if (checkoutWhatsAppBtn) {
            checkoutWhatsAppBtn.addEventListener('click', () => {
                let message = "Halo Admin,\nSaya ingin memesan item berikut:\n\n";
                let totalBelanja = 0;
                cart.forEach(item => {
                    message += `* ${item.name}\n`;
                    message += `  Kuantitas: ${item.quantity}\n`;
                    let itemPriceString = formatRupiahApp(item.price * item.quantity);
                    if (item.billingCycle) {
                        itemPriceString += ` (${item.billingCycle})`;
                    }
                    message += `  Harga: ${itemPriceString}\n\n`;
                    totalBelanja += item.price * item.quantity;
                });
                message += `*Total Belanja: ${formatRupiahApp(totalBelanja)}*\n\n`;
                message += "Mohon informasikan langkah selanjutnya untuk pembayaran.\nTerima kasih.";

                const whatsappUrl = `https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            });
        }

        // Tombol Kosongkan Keranjang
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                // Gunakan konfirmasi custom jika alert/confirm diblokir
                showCustomConfirm("Anda yakin ingin mengosongkan keranjang?", () => {
                    cart = [];
                    saveCart();
                    renderCartSummary();
                    showNotification("Keranjang telah dikosongkan.", "warning");
                });
            });
        }

        // Tombol +/- kuantitas dan hapus item (gunakan event delegation pada modal body)
        const currentModalBody = (cartSummaryContainerTestimonials || cartSummaryContainer);
        if (currentModalBody) {
            currentModalBody.addEventListener('click', function(event) {
                const target = event.target;
                if (target.classList.contains('increase-qty-btn') || target.closest('.increase-qty-btn')) {
                    const btn = target.closest('.increase-qty-btn');
                    updateItemQuantity(parseInt(btn.dataset.id), 1);
                } else if (target.classList.contains('decrease-qty-btn') || target.closest('.decrease-qty-btn')) {
                    const btn = target.closest('.decrease-qty-btn');
                    updateItemQuantity(parseInt(btn.dataset.id), -1);
                } else if (target.classList.contains('remove-item-btn') || target.closest('.remove-item-btn')) {
                    const btn = target.closest('.remove-item-btn');
                    showCustomConfirm("Hapus item ini dari keranjang?", () => {
                        removeItemFromCart(parseInt(btn.dataset.id));
                    });
                }
            });
        }
    }

    function updateItemQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const productInCart = cart[itemIndex]; // Item dari keranjang sudah punya info stok jika disimpan
            const newQuantity = productInCart.quantity + change;

            if (newQuantity <= 0) {
                removeItemFromCart(productId); // Hapus jika kuantitas jadi 0 atau kurang
            } else if (productInCart.stock !== undefined && newQuantity > productInCart.stock) {
                showNotification(`Stok "${productInCart.name}" tidak mencukupi (tersisa ${productInCart.stock}).`, 'error');
            }
            else {
                cart[itemIndex].quantity = newQuantity;
                saveCart();
                renderCartSummary(); // Update tampilan modal
            }
        }
    }

    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCartSummary(); // Update tampilan modal
        showNotification("Item dihapus dari keranjang.", "warning");
    }


    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartItemCount(); // Update badge setiap kali menyimpan
    }

    // --- Logika Buka/Tutup Modal ---
    const openModalButtons = [viewCartBtn, viewCartBtnMobile, viewCartBtnTestimonials, viewCartBtnMobileTestimonials];
    openModalButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                renderCartSummary(); // Selalu render ulang isi keranjang saat modal dibuka
                if (cartModal) cartModal.style.display = "block";
            });
        }
    });


    if (closeCartModalBtn) {
        closeCartModalBtn.addEventListener('click', () => {
            if (cartModal) cartModal.style.display = "none";
        });
    }

    // Tutup modal jika klik di luar area modal-content
    window.addEventListener('click', (event) => {
        if (cartModal && event.target == cartModal) {
            cartModal.style.display = "none";
        }
    });


    // --- Panggil updateCartItemCount saat halaman dimuat ---
    updateCartItemCount(); // Untuk menginisialisasi badge saat load


    // --- Tombol "Add to Cart" ---
    // Menggunakan event delegation pada body untuk menangani tombol yang dimuat dinamis
    document.body.addEventListener('click', function(event) {
        const cartButton = event.target.closest('.add-to-cart-btn'); // Lebih robust

        if (cartButton) {
            const productId = parseInt(cartButton.dataset.productId);
            // Pastikan allProductsData tersedia (dari products.js)
            if (typeof allProductsData === 'undefined') {
                showNotification("Data produk tidak tersedia.", "error");
                return;
            }
            const productToAdd = allProductsData.find(p => p.id === productId);

            if (productToAdd) {
                const existingProductIndex = cart.findIndex(item => item.id === productId);

                if (existingProductIndex > -1) {
                    // Produk sudah ada, tingkatkan kuantitas
                    // Cek stok dari data produk asli atau dari item di keranjang jika sudah disimpan
                    const stockToCheck = productToAdd.stock !== undefined ? productToAdd.stock : cart[existingProductIndex].stock;
                    if (stockToCheck !== undefined && cart[existingProductIndex].quantity >= stockToCheck) {
                        showNotification(`Stok "${cart[existingProductIndex].name}" tidak mencukupi.`, 'error');
                    } else {
                        cart[existingProductIndex].quantity++;
                        showNotification(`Kuantitas "${cart[existingProductIndex].name}" diperbarui.`);
                    }
                } else {
                    // Produk belum ada, tambahkan baru
                    if (productToAdd.stock !== undefined && productToAdd.stock <= 0) {
                        showNotification(`"${productToAdd.name}" habis terjual.`, 'error');
                    } else {
                        cart.push({
                            id: productToAdd.id,
                            name: productToAdd.name,
                            price: productToAdd.price,
                            imageUrl: productToAdd.imageUrl,
                            quantity: 1,
                            stock: productToAdd.stock, // Simpan info stok jika ada
                            billingCycle: productToAdd.billingCycle // Simpan info billing cycle jika ada
                        });
                        showNotification(`"${productToAdd.name}" berhasil ditambahkan!`);
                    }
                }
                saveCart();
                // Jika modal keranjang sedang terbuka, render ulang isinya
                if (cartModal && cartModal.style.display === "block") {
                    renderCartSummary();
                }
            } else {
                showNotification("Produk tidak ditemukan.", 'error');
            }
        }
    });

    // --- Tampilkan Produk (dari products.js) ---
    // Pastikan fungsi-fungsi ini tersedia global dari products.js
    if (typeof displayProducts === 'function' && typeof getMostBoughtProducts === 'function' && document.getElementById('most-bought-products')) {
        displayProducts(getMostBoughtProducts(4), 'most-bought-products');
    }
    if (typeof displayProducts === 'function' && typeof getPopularProducts === 'function' && document.getElementById('popular-products')) {
        displayProducts(getPopularProducts(4), 'popular-products');
    }
    if (typeof displayProducts === 'function' && typeof getPromoProducts === 'function' && document.getElementById('promo-products')) {
        displayProducts(getPromoProducts(4), 'promo-products');
    }

    // Untuk halaman "Semua Produk" dengan paginasi dan filter
    if (typeof displayPaginatedProducts === 'function' && typeof allProductsData !== 'undefined' && document.getElementById('all-products-grid')) {
        let currentAllProducts = [...allProductsData]; // Salinan untuk filtering/sorting
        displayPaginatedProducts(currentAllProducts, 'all-products-grid', 1);

        const searchInput = document.getElementById('search-product');
        const sortSelect = document.getElementById('sort-product');

        function applyFiltersAndSort() {
            let filteredProducts = [...allProductsData];
            const searchTerm = searchInput.value.toLowerCase();
            const sortValue = sortSelect.value;

            // Filter berdasarkan pencarian
            if (searchTerm) {
                filteredProducts = filteredProducts.filter(p =>
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.description.toLowerCase().includes(searchTerm) ||
                    (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchTerm))) // Cek jika tags ada
                );
            }

            // Sortir
            switch (sortValue) {
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'name-asc':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-desc':
                    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                // default (atau 'default') tidak perlu sorting khusus atau berdasarkan ID/urutan awal
            }
            currentAllProducts = filteredProducts;
            displayPaginatedProducts(currentAllProducts, 'all-products-grid', 1); // Reset ke halaman 1
        }

        if (searchInput) searchInput.addEventListener('input', applyFiltersAndSort);
        if (sortSelect) sortSelect.addEventListener('change', applyFiltersAndSort);
    }


    // --- Footer Current Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}); // End DOMContentLoaded

// --- Fungsi Notifikasi Global ---
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.warn("Elemen notifikasi tidak ditemukan.");
        // Fallback sederhana jika elemen notifikasi tidak ada, meskipun idealnya elemen ini selalu ada.
        alert(`${type.toUpperCase()}: ${message}`);
        return;
    }

    notification.textContent = message;
    notification.className = 'notification show'; // Reset kelas dan tampilkan

    // Atur warna berdasarkan tipe notifikasi (sesuaikan dengan variabel CSS Anda)
    if (type === 'error') {
        notification.style.backgroundColor = 'var(--accent-color)'; // Contoh: Merah muda
        notification.style.color = '#fff'; // Teks putih agar kontras
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#ffc107'; // Contoh: Kuning
        notification.style.color = 'var(--bg-color)'; // Teks gelap
    } else { // success (default)
        notification.style.backgroundColor = 'var(--secondary-color)'; // Contoh: Mint
        notification.style.color = 'var(--bg-color)'; // Teks gelap
    }

    // Sembunyikan notifikasi setelah durasi tertentu
    setTimeout(() => {
        notification.classList.remove('show');
        // Optional: Tambahkan animasi keluar jika ada di CSS
        // notification.classList.add('slide-out');
        // setTimeout(() => notification.classList.remove('slide-out'), 300);
    }, duration);
}

// --- Fungsi Konfirmasi Custom (Pengganti confirm() jika diblokir) ---
function showCustomConfirm(message, onConfirm, onCancel) {
    // Anda perlu membuat elemen HTML untuk dialog konfirmasi ini
    // Untuk sekarang, kita akan fallback ke confirm() bawaan browser.
    // Jika confirm() juga diblokir di environment Anda, maka Anda HARUS membuat UI custom.
    if (window.confirm(message)) {
        if (onConfirm && typeof onConfirm === 'function') {
            onConfirm();
        }
    } else {
        if (onCancel && typeof onCancel === 'function') {
            onCancel();
        }
    }
}
