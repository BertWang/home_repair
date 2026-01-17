/**
 * Wen-A Renovation (溫ㄟ宅修) - Base JavaScript
 * 處理導覽列、動畫、手機選單與案例輪播
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Tailwind 配置 (配合 CDN) ---
    if (typeof tailwind !== 'undefined') {
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'stone-paper': '#F9F8F6',
                        'stone-dark': '#2C2C2C',
                        'stone-light': '#888888',
                        'wood-accent': '#B3A08D',
                    },
                    fontFamily: {
                        sans: ['"Noto Sans TC"', '"Manrope"', 'sans-serif'],
                        mono: ['"Manrope"', 'monospace'],
                    },
                    letterSpacing: {
                        tighter: '-0.05em',
                        widest: '0.15em',
                    },
                },
            },
        };
    }

    // --- 2. Lucide 圖示初始化 ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 3. 導覽列 (Navbar) 滾動效果 ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleNavbarScroll = () => {
            if (window.scrollY > 20) {
                // 滾動中狀態：毛玻璃 + 縮減高度
                navbar.classList.add('bg-white/80', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-stone-200/50', 'py-4');
                navbar.classList.remove('bg-transparent', 'py-6', 'md:py-8');
            } else {
                // 頂部初始狀態：透明 + 原始高度
                navbar.classList.remove('bg-white/80', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-stone-200/50', 'py-4');
                navbar.classList.add('bg-transparent', 'py-6', 'md:py-8');
            }
        };

        window.addEventListener('scroll', handleNavbarScroll);
        handleNavbarScroll(); // 初始化
    }

    // --- 4. 滾動動畫 (Reveal Animations) ---
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- 5. 手機選單 (Mobile Menu) ---
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const bars = {
        bar1: document.getElementById('bar1'),
        bar2: document.getElementById('bar2'),
        bar3: document.getElementById('bar3')
    };
    const floatingCta = document.getElementById('floating-cta');
    let isMenuOpen = false;

    /**
     * 重設選單狀態為關閉
     */
    const closeMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');

        if (floatingCta) floatingCta.classList.remove('hidden');
        if (bars.bar1) {
            bars.bar1.classList.remove('translate-y-2', 'rotate-45');
            bars.bar2.classList.remove('opacity-0');
            bars.bar3.classList.remove('-translate-y-2', '-rotate-45');
        }

        document.body.style.overflow = '';
        isMenuOpen = false;
    };

    /**
     * 切換選單狀態
     */
    const toggleMenu = () => {
        if (!mobileMenu) return;

        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            // 開啟選單
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
            document.body.style.overflow = 'hidden';

            if (bars.bar1) {
                bars.bar1.classList.add('translate-y-2', 'rotate-45');
                bars.bar2.classList.add('opacity-0');
                bars.bar3.classList.add('-translate-y-2', '-rotate-45');
            }

            if (floatingCta) floatingCta.classList.add('hidden');
        } else {
            closeMenu();
        }
    };

    // 初始化選單狀態並公開方法
    closeMenu();
    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    window.toggleMenu = toggleMenu;

    // --- 6. 案例輪播 (Cases Carousel) ---
    const carousel = {
        track: document.getElementById('cases-track'),
        dotsContainer: document.getElementById('cases-dots'),
        prevBtn: document.getElementById('cases-prev'),
        nextBtn: document.getElementById('cases-next')
    };

    if (carousel.track) {
        const cards = Array.from(carousel.track.querySelectorAll('.case-card'));
        let activeIdx = 0;

        if (cards.length > 0) {
            // 初始化指示點 (Dots)
            if (carousel.dotsContainer) {
                cards.forEach((_, idx) => {
                    const dot = document.createElement('button');
                    dot.className = `w-2 h-2 rounded-full border border-stone-400 transition-colors ${idx === 0 ? 'bg-stone-900 border-stone-900' : 'bg-transparent'}`;
                    dot.addEventListener('click', () => scrollToIndex(idx));
                    carousel.dotsContainer.appendChild(dot);
                });
            }

            const dots = carousel.dotsContainer ? Array.from(carousel.dotsContainer.children) : [];

            const updateDots = (index) => {
                dots.forEach((dot, i) => {
                    if (i === index) {
                        dot.classList.add('bg-stone-900', 'border-stone-900');
                        dot.classList.remove('bg-transparent');
                    } else {
                        dot.classList.remove('bg-stone-900', 'border-stone-900');
                        dot.classList.add('bg-transparent');
                    }
                });
            };

            const scrollToIndex = (index) => {
                const clamped = Math.max(0, Math.min(index, cards.length - 1));
                const targetCard = cards[clamped];
                const offset = targetCard.offsetLeft - carousel.track.clientWidth * 0.1;

                carousel.track.scrollTo({ left: offset, behavior: 'smooth' });
                activeIdx = clamped;
                updateDots(activeIdx);
            };

            // 綁定控制按鈕
            carousel.prevBtn?.addEventListener('click', () => scrollToIndex(activeIdx - 1));
            carousel.nextBtn?.addEventListener('click', () => scrollToIndex(activeIdx + 1));

            // 手動捲動時同步更新 dots
            carousel.track.addEventListener('scroll', () => {
                const trackCenter = carousel.track.scrollLeft + carousel.track.clientWidth / 2;
                let closestIdx = 0;
                let minDistance = Infinity;

                cards.forEach((card, idx) => {
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    const distance = Math.abs(cardCenter - trackCenter);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestIdx = idx;
                    }
                });

                if (closestIdx !== activeIdx) {
                    activeIdx = closestIdx;
                    updateDots(activeIdx);
                }
            });
        }
    }

    // --- 7. 頁尾顯示效果 (Footer Reveal) ---
    const footer = document.querySelector('footer');
    if (footer) {
        const footerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-8');
                    }
                });
            },
            { threshold: 0.1 }
        );

        // footer.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
        footer.classList.add('transition-all', 'duration-700');
        footerObserver.observe(footer);
    }
});

