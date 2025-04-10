document.addEventListener('DOMContentLoaded', () => {
    // ナビゲーション関連の要素
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // ハンバーガーメニューの制御
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        navbarCollapse.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    });

    // ナビゲーションリンククリック時の処理
    navbarCollapse.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
            navbarCollapse.classList.remove('show');
            document.body.classList.remove('menu-open');
        });
    });

    // スクロールイベントの最適化（スロットリング）
    let ticking = false;

    // スクロールイベントリスナー
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    /**
     * スクロール位置に応じてヘッダーのスタイルを変更
     */
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // 初期ロード時にもスクロール位置をチェック
    handleScroll();

    // スムーズスクロールの実装
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 事例紹介スライダー
    const sliderTrack = document.querySelector('.slider-track');
    const sliderItems = document.querySelectorAll('.case-item');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const sliderIndicators = document.querySelector('.slider-indicators');

    if (sliderTrack && sliderItems.length > 0) {
        let currentSlide = 0;
        const totalSlides = sliderItems.length;

        // スライダーの幅を設定
        function setSliderWidth() {
            const itemWidth = sliderItems[0].offsetWidth;
            sliderTrack.style.width = `${itemWidth * totalSlides}px`;
        }

        // スライドを表示する関数
        function showSlide(index) {
            const itemWidth = sliderItems[0].offsetWidth;
            sliderTrack.style.transform = `translateX(${-itemWidth * index}px)`;

            // インジケーターの更新
            document.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
            });

            // スクリーンリーダー向けステータス更新
            const statusElement = document.getElementById('slider-status');
            statusElement.textContent = `事例 ${index + 1}/${totalSlides} を表示中`;

            currentSlide = index;
        }

        // インジケーターの生成
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `事例 ${i + 1} へ移動`);
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => showSlide(i));
            sliderIndicators.appendChild(dot);
        }

        // 前へボタンのイベントリスナー
        sliderPrev.addEventListener('click', () => {
            const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(newIndex);
        });

        // 次へボタンのイベントリスナー
        sliderNext.addEventListener('click', () => {
            const newIndex = (currentSlide + 1) % totalSlides;
            showSlide(newIndex);
        });

        // ウィンドウリサイズ時の処理
        window.addEventListener('resize', () => {
            setSliderWidth();
            showSlide(currentSlide);
        });

        // 初期化
        setSliderWidth();
        showSlide(0);

        // タッチスワイプ対応
        let touchStartX = 0;
        let touchEndX = 0;

        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // 左スワイプ
                const newIndex = (currentSlide + 1) % totalSlides;
                showSlide(newIndex);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // 右スワイプ
                const newIndex = (currentSlide - 1 + totalSlides) % totalSlides;
                showSlide(newIndex);
            }
        }

        // 自動スライド（オプション）
        let slideInterval;

        function startAutoSlide() {
            slideInterval = setInterval(() => {
                const newIndex = (currentSlide + 1) % totalSlides;
                showSlide(newIndex);
            }, 5000); // 5秒ごとに切り替え
        }

        function stopAutoSlide() {
            clearInterval(slideInterval);
        }

        // スライダーにマウスが乗ったら自動スライドを停止
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);

        // 自動スライド開始
        startAutoSlide();
    }

    // アニメーション要素の監視
    const animateElements = document.querySelectorAll('.animate-element');

    if (animateElements.length > 0) {
        // ユーザーがモーション低減を希望しているかチェック
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefersReducedMotion) {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animation = element.dataset.animation || 'fade-up';
                        const delay = element.dataset.delay || 0;

                        setTimeout(() => {
                            element.classList.add(animation);
                        }, delay);

                        observer.unobserve(element);
                    }
                });
            }, observerOptions);

            animateElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // モーション低減が有効な場合、すべての要素を即座に表示
            animateElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
        }
    }
});

// スライダーの自動再生もモーション設定に基づいて調整
function setupAutoSlide() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // 自動スライドを無効化
        return null;
    } else {
        // 自動スライド開始
        return setInterval(() => {
            const newIndex = (currentSlide + 1) % totalSlides;
            showSlide(newIndex);
        }, 5000); // 5秒ごとに切り替え
    }
}

// スライダーの自動再生を設定
let slideInterval = setupAutoSlide();

// メディアクエリの変更を監視
const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
motionMediaQuery.addEventListener('change', () => {
    // モーション設定が変更された場合、スライダーの自動再生を再設定
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    slideInterval = setupAutoSlide();

    // アニメーション要素も更新
    if (motionMediaQuery.matches) {
        animateElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }
});

// フォームバリデーションのJavaScript
document.querySelector('form').addEventListener('submit', function (e) {
    let hasError = false;

    // 各入力フィールドをチェック
    this.querySelectorAll('input[required], textarea[required]').forEach(field => {
        const errorElement = document.getElementById(`${field.id}-error`);

        if (!field.value.trim()) {
            e.preventDefault();
            hasError = true;
            field.classList.add('is-invalid');
            field.setAttribute('aria-invalid', 'true');
            errorElement.textContent = `${field.labels[0].textContent.replace('（必須）', '').trim()}を入力してください。`;
        } else {
            field.classList.remove('is-invalid');
            field.setAttribute('aria-invalid', 'false');
            errorElement.textContent = '';
        }
    });

    // メールアドレスの追加バリデーション
    const emailField = this.querySelector('#email');
    const emailError = document.getElementById('email-error');

    if (emailField.value && !isValidEmail(emailField.value)) {
        e.preventDefault();
        hasError = true;
        emailField.classList.add('is-invalid');
        emailField.setAttribute('aria-invalid', 'true');
        emailError.textContent = '有効なメールアドレスを入力してください。';
    }

    // エラーがある場合、最初のエラーフィールドにフォーカス
    if (hasError) {
        this.querySelector('.is-invalid').focus();
    }
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
