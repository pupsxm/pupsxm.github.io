window.addEventListener('DOMContentLoaded', function () {

    'use strict';

    var form = document.getElementById('calc-form');
    var productField = document.getElementById('calc-product');
    var quantityField = document.getElementById('calc-quantity');
    var resultBox = document.getElementById('calc-result');
    var errorBox = document.getElementById('calc-error');

    function calculate() {
        var quantity = quantityField.value;
        var price;
        var count;
        var total;

        resultBox.innerHTML = '';
        errorBox.innerHTML = '';

        if (!/^\d+$/.test(quantity)) {
            errorBox.innerHTML = 'Введите целое положительное число без букв и знаков.';
            return;
        }

        price = parseInt(productField.value, 10);
        count = parseInt(quantity, 10);

        if (count <= 0) {
            errorBox.innerHTML = 'Количество должно быть больше нуля.';
            return;
        }

        total = price * count;
        resultBox.innerHTML = 'Стоимость заказа: ' + total + ' ₽';
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        calculate();
    });

});
