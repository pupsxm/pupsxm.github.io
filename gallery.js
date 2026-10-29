/*jslint browser: true */
/*global window, document */

window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    var track = document.getElementById('gallery-track');
    var prevBtn = document.getElementById('gallery-prev');
    var nextBtn = document.getElementById('gallery-next');
    var pager = document.getElementById('gallery-pager');
    var viewport = document.querySelector('.gallery-viewport'); // Контейнер с картинками
    var items = document.querySelectorAll('.gallery-item');

    var currentIndex = 0;

    // Функция для вычисления количества видимых картинок
    function getVisibleCount() {
        if (window.innerWidth >= 768) {
            return 3; // Десктоп
        }
        return 1; // Мобильный
    }

    // Функция для перерисовки галереи
    function updateGallery() {
        var visibleCount = getVisibleCount();
        var maxIndex = items.length - visibleCount;

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        // Двигаем ленту
        var shiftPercent = (100 / visibleCount) * currentIndex;
        track.style.transform = 'translateX(-' + shiftPercent + '%)';

        // Обновляем пейджер
        buildPager();
    }

    // Функция для создания точек пейджера
    function buildPager() {
        var visibleCount = getVisibleCount();
        var totalPages = Math.ceil(items.length / visibleCount);
        
        pager.innerHTML = '';

        for (var i = 0; i < totalPages; i++) {
            var dot = document.createElement('button');
            dot.className = 'pager-dot';
            dot.setAttribute('type', 'button');
            dot.setAttribute('aria-label', 'Страница ' + (i + 1));
            
            if (i === Math.floor(currentIndex / visibleCount)) {
                dot.classList.add('active');
            }

            (function(pageIndex) {
                dot.addEventListener('click', function() {
                    currentIndex = pageIndex * visibleCount;
                    updateGallery();
                });
            })(i);

            pager.appendChild(dot);
        }
    }

    // Кнопка "Назад"
    prevBtn.addEventListener('click', function () {
        var visibleCount = getVisibleCount();
        currentIndex -= visibleCount; 
        updateGallery();
    });

    // Кнопка "Вперёд"
    nextBtn.addEventListener('click', function () {
        var visibleCount = getVisibleCount();
        currentIndex += visibleCount;
        updateGallery();
    });

    // Пересчет при изменении размера окна
    window.addEventListener('resize', function () {
        updateGallery();
    });

    // ==========================================
    // Обработка свайпов пальцем для мобильных
    // ==========================================
    var startX = 0;
    var endX = 0;
    var minSwipeDistance = 50; // Минимальная длина свайпа (в пикселях)

    // Запоминаем точку касания
    viewport.addEventListener('touchstart', function (event) {
        startX = event.changedTouches[0].screenX;
    }, { passive: true });

    // Отслеживаем движение пальца
    viewport.addEventListener('touchmove', function (event) {
        endX = event.changedTouches[0].screenX;
    }, { passive: true });

    // Отпускание пальца
    viewport.addEventListener('touchend', function () {
        var distance = startX - endX;
        
        // Если палец сдвинулся достаточно далеко
        if (Math.abs(distance) > minSwipeDistance) {
            var visibleCount = getVisibleCount();
            
            if (distance > 0) {
                // Свайп влево (палец ведем справа налево) — листаем вперед
                currentIndex += visibleCount;
            } else {
                // Свайп вправо (палец ведем слева направо) — листаем назад
                currentIndex -= visibleCount;
            }
            updateGallery();
        }
        
        // Сбрасываем значения для следующего свайпа
        startX = 0;
        endX = 0;
    });

    // Первичная инициализация
    updateGallery();
});