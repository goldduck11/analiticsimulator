-- Темы
INSERT INTO topics (name) VALUES
('SQL'),
('Метрики и аналитика'),
('Валидация данных');

-- Задания: tasktype 0=TEST, 1=ERROR_DETECTION, 2=PRACTICE | complexity 0=EASY, 1=MEDIUM, 2=HARD
-- ui_payload — JSON для фронта (варианты теста / строки «найди ошибку»)

INSERT INTO tasks (question, tasktype, topic_id, hint, max_score, complexity, ui_payload) VALUES
('Какой запрос выбирает все записи из таблицы users?', 0, 1, 'Используйте SELECT и *', 100, 0,
 '{"questions":[{"id":"q1","question":"","options":[{"id":"o1","text":"SELECT * FROM users;"},{"id":"o2","text":"SELECT users FROM *;"},{"id":"o3","text":"GET ALL FROM users;"},{"id":"o4","text":"FETCH * FROM users TABLE;"}]}]}'),

('Какая команда фильтрует строки в SQL?', 0, 1, 'Например: ... WHERE age > 18', 100, 1,
 '{"questions":[{"id":"q1","question":"","options":[{"id":"o1","text":"WHERE"},{"id":"o2","text":"HAVING"},{"id":"o3","text":"GROUP BY"},{"id":"o4","text":"ORDER BY"}]}]}'),

('Что делает JOIN?', 0, 1, 'Используется для связывания таблиц', 100, 2,
 '{"questions":[{"id":"q1","question":"","options":[{"id":"o1","text":"Объединяет таблицы по условию"},{"id":"o2","text":"Удаляет дубликаты без условия"},{"id":"o3","text":"Сортирует строки по индексу"},{"id":"o4","text":"Создаёт временную копию базы"}]}]}'),

('Найдите ошибку в фрагментах SQL ниже.', 1, 1, 'Проверьте написание ключевых слов', 100, 0,
 '{"scenario":"Отметьте только строки с синтаксической или орфографической ошибкой в SQL.","artifacts":[{"id":"ok1","text":"-- Запрос A: подсчёт строк","hasError":false},{"id":"FORM","text":"SELECT * FORM users;","hasError":true},{"id":"ok2","text":"SELECT id, name FROM users LIMIT 5;","hasError":false}]}'),

('Найдите ошибку в фрагментах SQL ниже.', 1, 1, 'Опечатка в команде выборки', 100, 1,
 '{"scenario":"Выберите строки с ошибкой.","artifacts":[{"id":"ok1","text":"SELECT COUNT(*) FROM orders;","hasError":false},{"id":"SELEC","text":"SELEC * FROM orders;","hasError":true},{"id":"ok2","text":"UPDATE orders SET status = ''done'' WHERE id = 1;","hasError":false}]}'),

('Найдите ошибку в фрагментах SQL ниже.', 1, 1, 'Ключевое слово для условия в UPDATE', 100, 2,
 '{"scenario":"Найдите ошибку в условии обновления.","artifacts":[{"id":"ok1","text":"DELETE FROM logs WHERE created_at < NOW() - INTERVAL ''7 days'';","hasError":false},{"id":"WERE","text":"UPDATE users SET name = ''John'' WERE id = 1;","hasError":true},{"id":"ok2","text":"INSERT INTO events (type) VALUES (''signup'');","hasError":false}]}'),

('Рассчитайте DAU за вчера.', 2, 2, 'Напишите SQL или опишите логику подсчёта Daily Active Users.', 100, 1, NULL),
('Предложите метрику для онбординга.', 2, 2, 'Как измерить успешность первого опыта пользователя?', 100, 0, NULL),
('Как проверить, что рост регистраций не от ботов?', 2, 3, 'Подумайте о поведенческих аномалиях.', 100, 2, NULL),
('Как доказать корректность A/B-теста?', 2, 3, 'Проверьте балансировку, объём выборки, стабильность метрик.', 100, 1, NULL);

-- Ответы для TEST: текст выбранного варианта должен совпадать с одной из строк (без учёта регистра)
INSERT INTO task_answers (task_id, answer) VALUES
(1, 'SELECT * FROM users;'),
(1, 'select * from users;'),
(2, 'WHERE'),
(2, 'where'),
(3, 'Объединяет таблицы по условию'),
(3, 'объединяет таблицы по условию'),
(3, 'JOIN объединяет таблицы');

-- ERROR_DETECTION: в foundErrors уходят id артефактов — для верных совпадают с этими строками
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
