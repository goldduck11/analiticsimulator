-- Темы
INSERT INTO topics (name) VALUES
('SQL'),
('Метрики и аналитика'),
('Валидация данных');

-- TEST задания
INSERT INTO tasks (question, tasktype, topic_id, hint, max_score) VALUES
('Какой запрос выбирает все записи из таблицы users?', 0, 1, 'Используйте SELECT и *', 100),
('Какая команда фильтрует строки в SQL?', 0, 1, 'Например: ... WHERE age > 18', 100),
('Что делает JOIN?', 0, 1, 'Используется для связывания таблиц', 100);

-- ERROR_DETECTION задания
INSERT INTO tasks (question, tasktype, topic_id, hint, max_score) VALUES
('Найдите ошибку: SELECT * FORM users;', 1, 1, 'Проверьте написание ключевого слова', 100),
('Исправьте: SELEC * FROM orders;', 1, 1, 'Опечатка в команде', 100),
('Где ошибка: UPDATE users SET name = ''John'' WERE id = 1;', 1, 1, 'Ключевое слово для условия', 100);

-- PRACTICE задания
INSERT INTO tasks (question, tasktype, topic_id, hint, max_score) VALUES
('Рассчитайте DAU за вчера.', 2, 2, 'Напишите SQL или опишите логику подсчёта Daily Active Users.', 100),
('Предложите метрику для онбординга.', 2, 2, 'Как измерить успешность первого опыта пользователя?', 100),
('Как проверить, что рост регистраций не от ботов?', 2, 3, 'Подумайте о поведенческих аномалиях.', 100),
('Как доказать корректность A/B-теста?', 2, 3, 'Проверьте балансировку, объем выборки, стабильность метрик.', 100);

-- Ответы для TEST заданий
INSERT INTO task_answers (task_id, answer) VALUES
(1, 'SELECT * FROM users;'),
(1, 'select * from users;'),
(2, 'WHERE'),
(2, 'where'),
(3, 'Объединяет таблицы по условию'),
(3, 'объединяет таблицы по условию'),
(3, 'JOIN объединяет таблицы');

-- Ответы для ERROR_DETECTION заданий
INSERT INTO task_answers (task_id, answer) VALUES
(4, 'FORM'),
(4, 'FROM вместо FORM'),
(4, 'ошибка в FORM'),
(5, 'SELEC'),
(5, 'SELECT вместо SELEC'),
(5, 'ошибка в SELEC'),
(6, 'WERE'),
(6, 'WHERE вместо WERE'),
(6, 'ошибка в WERE');