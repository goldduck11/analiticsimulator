-- Темы
INSERT INTO topics (name) VALUES
('SQL'),
('Метрики и аналитика'),
('Валидация данных');

-- TEST задания
INSERT INTO tasks (question, answer, type, topic_id, hint) VALUES
('Какой запрос выбирает все записи из таблицы users?', 'SELECT * FROM users;', 'TEST', 1, 'Используйте SELECT и *'),
('Какая команда фильтрует строки в SQL?', 'WHERE', 'TEST', 1, 'Например: ... WHERE age > 18'),
('Что делает JOIN?', 'Объединяет таблицы по условию', 'TEST', 1, 'Используется для связывания таблиц');

-- ERROR_DETECTION задания
INSERT INTO tasks (question, answer, type, topic_id, hint) VALUES
('Найдите ошибку: SELECT * FORM users;', 'FORM', 'ERROR_DETECTION', 1, 'Проверьте написание ключевого слова'),
('Исправьте: SELEC * FROM orders;', 'SELEC', 'ERROR_DETECTION', 1, 'Опечатка в команде'),
('Где ошибка: UPDATE users SET name = ''John'' WERE id = 1;', 'WERE', 'ERROR_DETECTION', 1, 'Ключевое слово для условия');

-- PRACTICE задания
INSERT INTO tasks (question, answer, type, topic_id, hint, max_score) VALUES
('Рассчитайте DAU за вчера.', 'Эталонный ответ будет добавлен позже.', 'PRACTICE', 2, 'Напишите SQL или опишите логику подсчёта Daily Active Users.', 15),
('Предложите метрику для онбординга.', 'Эталонный ответ будет добавлен позже.', 'PRACTICE', 2, 'Как измерить успешность первого опыта пользователя?', 15),
('Как проверить, что рост регистраций не от ботов?', 'Эталонный ответ будет добавлен позже.', 'PRACTICE', 3, 'Подумайте о поведенческих аномалиях.', 20),
('Как доказать корректность A/B-теста?', 'Эталонный ответ будет добавлен позже.', 'PRACTICE', 3, 'Проверьте балансировку, объем выборки, стабильность метрик.', 20);