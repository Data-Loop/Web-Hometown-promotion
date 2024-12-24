document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel-slides');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    let currentSlide = 0;
    const slideCount = slides.length;

    // 创建轮播点
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(n) {
        currentSlide = n;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        goToSlide(currentSlide);
    }

    // 自动轮播
    setInterval(nextSlide, 5000);

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
            // 向左滑
            currentSlide = (currentSlide + 1) % slideCount;
            goToSlide(currentSlide);
        } else if (touchEndX - touchStartX > 50) {
            // 向右滑
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            goToSlide(currentSlide);
        }
    });
}); 