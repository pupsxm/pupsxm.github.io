/*jslint browser: true */
/*global window, document, fetch, localStorage, history, URLSearchParams */

window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ВАЖНО: Замените YOUR_FORM_ID на ID вашей формы с formcarry.com
    var FORM_ENDPOINT = 'https://formcarry.com/s/587xh8VITmu';

    var modal = document.getElementById('feedback-modal');
    var openBtn = document.getElementById('open-feedback');
    var closeBtn = document.getElementById('close-feedback');
    var form = document.getElementById('feedback-form');
    var statusBox = document.getElementById('fb-status');
    var submitBtn = document.getElementById('fb-submit');

    // Поля формы для LocalStorage
    var fields = {
        name: document.getElementById('fb-name'),
        email: document.getElementById('fb-email'),
        phone: document.getElementById('fb-phone'),
        org: document.getElementById('fb-org'),
        msg: document.getElementById('fb-msg'),
        agree: document.getElementById('fb-agree')
    };

    // 1. Функции открытия и закрытия попапа
    function openModal(updateUrl) {
        modal.classList.add('active');
        loadData(); // Восстанавливаем данные из LocalStorage

        if (updateUrl !== false) {
            // Меняем URL с помощью History API
            var url = new URL(window.location.href);
            url.searchParams.set('feedback', 'open');
            history.pushState({ feedbackOpen: true }, '', url.toString());
        }
    }

    function closeModal(updateUrl) {
        modal.classList.remove('active');
        statusBox.innerHTML = '';

        if (updateUrl !== false) {
            // Возвращаем URL обратно
            var url = new URL(window.location.href);
            url.searchParams.delete('feedback');
            history.pushState({ feedbackOpen: false }, '', url.toString());
        }
    }

    // Слушатели кнопок
    openBtn.addEventListener('click', function () { openModal(true); });
    closeBtn.addEventListener('click', function () { closeModal(true); });

    // Закрытие по клику на темный фон
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal(true);
        }
    });

    // 2. Обработка кнопки "Назад" в браузере (History API)
    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.feedbackOpen) {
            openModal(false); // Открываем, но URL уже изменен кнопкой Назад
        } else {
            closeModal(false); // Закрываем
        }
    });

    // Проверка при загрузке страницы: если в URL есть ?feedback=open
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('feedback') === 'open') {
        openModal(false);
        // Заменяем текущее состояние, чтобы кнопка Назад работала корректно
        history.replaceState({ feedbackOpen: true }, '', window.location.href);
    } else {
        history.replaceState({ feedbackOpen: false }, '', window.location.href);
    }

    // 3. Работа с LocalStorage (Сохранение и восстановление)
    function saveData() {
        var data = {
            name: fields.name.value,
            email: fields.email.value,
            phone: fields.phone.value,
            org: fields.org.value,
            msg: fields.msg.value,
            agree: fields.agree.checked
        };
        localStorage.setItem('feedbackData', JSON.stringify(data));
    }

    function loadData() {
        var saved = localStorage.getItem('feedbackData');
        if (saved) {
            var data = JSON.parse(saved);
            fields.name.value = data.name || '';
            fields.email.value = data.email || '';
            fields.phone.value = data.phone || '';
            fields.org.value = data.org || '';
            fields.msg.value = data.msg || '';
            fields.agree.checked = data.agree || false;
        }
    }

    // Сохраняем данные при каждом вводе (событие input)
    form.addEventListener('input', saveData);

        // 4. Отправка формы через Fetch API
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Отменяем перезагрузку страницы

        // Проверка на заполнение (HTML5 валидация)
        if (!form.checkValidity()) {
            // Если есть ошибки, показываем сообщение и подсвечиваем поля
            form.classList.add('was-validated');
            
            // Находим первое невалидное поле и ставим на него фокус
            var firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return; // Прерываем отправку
        }

        // Если всё ок, убираем класс с ошибками
        form.classList.remove('was-validated');

        // Блокируем кнопку на время отправки
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        statusBox.innerHTML = '<span class="text-primary">Отправляем данные...</span>';

        // Собираем данные формы
        var formData = new FormData(form);

        // Отправляем POST-запрос
        fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            if (result.status === 'success') {
                // Успех
                statusBox.innerHTML = '<span class="text-success">Сообщение успешно отправлено!</span>';
                form.reset(); // Очищаем форму
                localStorage.removeItem('feedbackData'); // Очищаем LocalStorage
                
                // Автоматически закрываем попап через 2 секунды
                setTimeout(function () {
                    closeModal(true);
                }, 2000);
            } else {
                // Ошибка на стороне сервера
                statusBox.innerHTML = '<span class="text-danger">Ошибка: ' + (result.message || 'Не удалось отправить') + '</span>';
            }
        })
        .catch(function (error) {
            // Ошибка сети
            console.error(error);
            statusBox.innerHTML = '<span class="text-danger">Ошибка сети. Проверьте интернет-соединение.</span>';
        })
        .finally(function () {
            // Разблокируем кнопку в любом случае
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        });
    });

});