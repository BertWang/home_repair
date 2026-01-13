document.addEventListener('DOMContentLoaded', () => {
    // 1. Tailwind 設定
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

    // 2. Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Navbar Scroll Effect（只保留一套）
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const updateNavbar = () => {
            if (window.scrollY > 20) {
                // 滾動後：毛玻璃 + 縮小
                navbar.classList.add(
                    'bg-white/80',
                    'backdrop-blur-md',
                    'shadow-sm',
                    'border-b',
                    'border-stone-200/50',
                    'py-4'
                );
                navbar.classList.remove('bg-transparent', 'py-6', 'md:py-8');
            } else {
                // 頂部：透明
                navbar.classList.remove(
                    'bg-white/80',
                    'backdrop-blur-md',
                    'shadow-sm',
                    'border-b',
                    'border-stone-200/50',
                    'py-4'
                );
                navbar.classList.add('bg-transparent', 'py-6', 'md:py-8');
            }
        };

        window.addEventListener('scroll', updateNavbar);
        updateNavbar(); // 進站時先跑一次
    }

    // 4. Reveal Animations
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 5. Mobile Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    const bar3 = document.getElementById('bar3');
    const floatingCta = document.getElementById('floating-cta');

    let menuOpen = false;

    function initMenu() {
        if (mobileMenu) {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
        }
        if (floatingCta) {
            floatingCta.classList.remove('hidden');
        }
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        if (!mobileMenu) return;

        menuOpen = !menuOpen;

        if (menuOpen) {
            // 開啟選單
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
            document.body.style.overflow = 'hidden';

            if (bar1 && bar2 && bar3) {
                bar1.classList.add('translate-y-2', 'rotate-45');
                bar2.classList.add('opacity-0');
                bar3.classList.add('-translate-y-2', '-rotate-45');
            }

            if (floatingCta) floatingCta.classList.add('hidden');
        } else {
            // 關閉選單
            initMenu();
            if (bar1 && bar2 && bar3) {
                bar1.classList.remove('translate-y-2', 'rotate-45');
                bar2.classList.remove('opacity-0');
                bar3.classList.remove('-translate-y-2', '-rotate-45');
            }
        }
    }

    // 初始化狀態
    initMenu();

    // 綁定事件
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleMenu);
    }
    // 讓 HTML 裡的 onclick="toggleMenu()" 可以用
    window.toggleMenu = toggleMenu;

    console.log('Wen-A Renovation: JS initialized.');
});

// 6. Cases Carousel (mobile only)
const track = document.getElementById('cases-track');
const cards = track ? Array.from(track.querySelectorAll('.case-card')) : [];
const dotsContainer = document.getElementById('cases-dots');
const prevBtn = document.getElementById('cases-prev');
const nextBtn = document.getElementById('cases-next');

if (track && cards.length && dotsContainer && prevBtn && nextBtn) {
    let activeIndex = 0;

    // 建立 dots
    cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className =
            'w-2 h-2 rounded-full border border-stone-400 transition-colors';
        if (idx === 0) {
            dot.classList.add('bg-stone-900', 'border-stone-900');
        } else {
            dot.classList.add('bg-transparent');
        }
        dot.addEventListener('click', () => scrollToIndex(idx));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.remove('bg-stone-900', 'border-stone-900');
            dot.classList.remove('bg-transparent');
            if (i === index) {
                dot.classList.add('bg-stone-900', 'border-stone-900');
            } else {
                dot.classList.add('bg-transparent');
            }
        });
    }

    function scrollToIndex(index) {
        const clamped = Math.max(0, Math.min(index, cards.length - 1));
        const card = cards[clamped];
        const offsetLeft = card.offsetLeft - track.clientWidth * 0.1; // 保留一點左邊空間
        track.scrollTo({ left: offsetLeft, behavior: 'smooth' });
        activeIndex = clamped;
        updateDots(activeIndex);
    }

    prevBtn.addEventListener('click', () => {
        scrollToIndex(activeIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        scrollToIndex(activeIndex + 1);
    });

    // 當使用者手動滑動時，更新 dots 狀態
    track.addEventListener('scroll', () => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((card, idx) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(cardCenter - center);
            if (dist < minDist) {
                minDist = dist;
                closest = idx;
            }
        });
        if (closest !== activeIndex) {
            activeIndex = closest;
            updateDots(activeIndex);
        }
    });
}

// Footer reveal
const footerObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-8');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelector('footer')?.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
footerObserver.observe(document.querySelector('footer'));


function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');
    
    menu.classList.toggle('opacity-100');
    menu.classList.toggle('pointer-events-auto');
    
    // 漢堡圖標轉換動畫
    const lines = toggleBtn.querySelectorAll('span');
    lines.forEach((line, index) => {
        if (menu.classList.contains('opacity-100')) {
            line.style.transform = index === 1 ? 'translateX(100%)' : 
                                   index === 0 ? 'rotate(45deg) translate(4px, 4px)' : 
                                   'rotate(-45deg) translate(6px, -6px)';
        } else {
            line.style.transform = 'none';
        }
    });
    
    // 顯示關閉按鈕
    closeBtn.classList.toggle('opacity-100');
    closeBtn.classList.toggle('pointer-events-auto');
}

// 綁定事件
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mobile-menu-toggle').addEventListener('click', toggleMenu);
    document.getElementById('mobile-menu-close').addEventListener('click', toggleMenu);
    
    // 點選背景關閉
    document.getElementById('mobile-menu').addEventListener('click', function(e) {
        if (e.target === this) toggleMenu();
    });
});

// Hero Parallax + Typewriter
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.parallax-bg');
    parallax.forEach(bg => {
        const speed = bg.dataset.speed || 0.5;
        bg.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Typewriter Effect
function initTypewriter() {
    const text = document.querySelector('.typewriter-text');
    if (text) {
        const fullText = text.textContent;
        text.textContent = '';
        let i = 0;
        const type = () => {
            if (i < fullText.length) {
                text.textContent += fullText.charAt(i);
                i++;
                setTimeout(type, 80);
            }
        };
        type();
    }
}
document.addEventListener('DOMContentLoaded', initTypewriter);

