document.addEventListener('DOMContentLoaded', () => {
    // --- Salin Nomor Rekening/E-wallet ---
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.copytarget;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const textToCopy = targetElement.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showPaymentNotification(`Nomor ${targetId.split('-')[0].toUpperCase()} berhasil disalin: ${textToCopy}`);
                }).catch(err => {
                    console.error('Gagal menyalin: ', err);
                    showPaymentNotification('Gagal menyalin nomor.', 'error');
                });
            }
        });
    });

    // --- Tampilkan/Sembunyikan QRIS ---
    const toggleQrisBtn = document.getElementById('toggle-qris-btn');
    const qrisContainer = document.getElementById('qris-container');
    const qrisImage = document.getElementById('qris-image');

    if (toggleQrisBtn && qrisContainer && qrisImage && qrisImage.src && qrisImage.getAttribute('src') !== '') {
        toggleQrisBtn.addEventListener('click', () => {
            qrisContainer.classList.toggle('show');
            if (qrisContainer.classList.contains('show')) {
                toggleQrisBtn.textContent = 'Sembunyikan QRIS';
            } else {
                toggleQrisBtn.textContent = 'Tampilkan QRIS';
            }
        });
    } else if (toggleQrisBtn) {
        toggleQrisBtn.style.display = 'none';
        const qrisSection = document.querySelector('.qris-section');
        if (qrisSection && !qrisSection.querySelector('.no-qris-msg')) { // Cek agar tidak duplikat pesan
            const noQrisMsg = document.createElement('p');
            noQrisMsg.textContent = 'Gambar QRIS saat ini tidak tersedia.';
            noQrisMsg.style.marginTop = '1rem';
            noQrisMsg.classList.add('no-qris-msg');
            qrisSection.insertBefore(noQrisMsg, qrisContainer); // Sisipkan sebelum kontainer QRIS
        }
    }

    // --- Download QRIS ---
    const downloadQrisLink = document.querySelector('.btn-download-qris');
    if (downloadQrisLink) {
        downloadQrisLink.addEventListener('click', (e) => {
            if (!qrisImage || !qrisImage.src || qrisImage.getAttribute('src') === '') {
                e.preventDefault(); // Mencegah download jika gambar tidak ada
                showPaymentNotification('Gambar QRIS tidak tersedia untuk diunduh.', 'error');
                return;
            }
            showPaymentNotification('Mengunduh gambar QRIS...');
        });
    }

    // Panggil initializeScrollAnimations jika ada di global scope (dari app.js)
    // Jika tidak, definisikan versi sederhananya.
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
});

// Fungsi Notifikasi khusus untuk halaman payment (atau bisa digabung dengan global)
function showPaymentNotification(message, type = 'success', duration = 3000) {
    const notificationElement = document.getElementById('notification');
    if (!notificationElement) {
        console.warn("Elemen notifikasi tidak ditemukan di payment.html.");
        alert(message); // Fallback ke alert jika elemen notifikasi tidak ada
        return;
    }
    notificationElement.textContent = message;
    notificationElement.className = 'notification show'; // Reset kelas

    if (type === 'error') {
        notificationElement.style.backgroundColor = 'var(--accent-color)';
        notificationElement.style.color = '#fff';
    } else if (type === 'warning') {
        notificationElement.style.backgroundColor = '#ffc107';
        notificationElement.style.color = 'var(--bg-color)';
    } else { // success
        notificationElement.style.backgroundColor = 'var(--secondary-color)';
        notificationElement.style.color = 'var(--bg-color)';
    }

    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, duration);
}