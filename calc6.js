/*jslint browser: true */
/*global window, document */

window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Базовые цены товаров
    var BASE_PRICES = {
        p1: 1000,
        p2: 1500,
        p3: 2000
    };

    // Ссылки на элементы формы
    var form = document.getElementById('calc6-form');
    var inputQuantity = document.getElementById('c6-quantity');
    var inputOptionsBlock = document.getElementById('c6-options-block');
    var inputOptions = document.getElementById('c6-options');
    var inputPropertyBlock = document.getElementById('c6-property-block');
    var inputProperty = document.getElementById('c6-property');
    var resultBox = document.getElementById('c6-result');

    // Функция пересчета стоимости
    function calculatePrice() {
        var quantity = parseInt(inputQuantity.value, 10);
        var selectedProduct;
        var basePrice;
        var extraOptionPrice = 0;
        var extraPropertyPrice = 0;
        var total;

        // Защита от пустого значения или NaN
        if (isNaN(quantity) || quantity < 1) {
            quantity = 1;
        }

        // Получаем выбранный тип товара
        selectedProduct = document.querySelector('input[name="c6-product"]:checked').value;
        basePrice = BASE_PRICES[selectedProduct];

        // Если выбран Товар 2, берем цену опции из селекта
        if (selectedProduct === 'p2') {
            extraOptionPrice = parseInt(inputOptions.value, 10);
        }

        // Если выбран Товар 3 и стоит галочка, добавляем цену свойства
        if (selectedProduct === 'p3' && inputProperty.checked) {
            extraPropertyPrice = 300;
        }

        // Считаем итог: (База + Опция + Свойство) * Количество
        total = (basePrice + extraOptionPrice + extraPropertyPrice) * quantity;

        // Выводим результат на страницу
        resultBox.innerHTML = 'Итоговая стоимость: ' + total + ' ₽';
    }

    // Функция для управления видимостью селекта и чекбокса
    function updateFormVisibility() {
        var selectedProduct = document.querySelector('input[name="c6-product"]:checked').value;

        // Товар 1: ничего не показываем
        if (selectedProduct === 'p1') {
            inputOptionsBlock.style.display = 'none';
            inputPropertyBlock.style.display = 'none';
        } 
        // Товар 2: показываем только селект
        else if (selectedProduct === 'p2') {
            inputOptionsBlock.style.display = 'block';
            inputPropertyBlock.style.display = 'none';
        } 
        // Товар 3: показываем только чекбокс
        else if (selectedProduct === 'p3') {
            inputOptionsBlock.style.display = 'none';
            inputPropertyBlock.style.display = 'block';
        }

        // После смены видимости сразу пересчитываем цену
        calculatePrice();
    }

    // Навешиваем обработчики на изменения (input и change)
    // Событие 'input' срабатывает при каждом нажатии клавиши в поле количества
    inputQuantity.addEventListener('input', calculatePrice);
    
    // Событие 'change' срабатывает при выборе радио, селекта и чекбокса
    form.addEventListener('change', function (event) {
        // Если изменился тип товара — обновляем видимость
        if (event.target.name === 'c6-product') {
            updateFormVisibility();
        } else {
            // Если изменилось что-то другое — просто пересчитываем цену
            calculatePrice();
        }
    });

    // Предотвращаем отправку формы по Enter (чтобы страница не перезагружалась)
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        calculatePrice();
    });

    // Инициализация при первой загрузке страницы
    updateFormVisibility();
});