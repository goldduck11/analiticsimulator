DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Таблица: users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Таблица: topics (темы заданий)
CREATE TABLE topics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Таблица: tasks (задания)
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TEST', 'ERROR_DETECTION', 'PRACTICE')),
    topic_id BIGINT NOT NULL,
    hint TEXT,
    max_score INT DEFAULT 10,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

-- Таблица: user_progress (прогресс пользователя)
CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    user_answer TEXT,
    completed BOOLEAN DEFAULT false,
    score INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE (user_id, task_id) -- Один пользователь — один раз на задачу
);

-- Индексы для производительности
CREATE INDEX idx_user_progress_user_task ON user_progress(user_id, task_id);
CREATE INDEX idx_user_progress_completed ON user_progress(completed);
CREATE INDEX idx_tasks_topic ON tasks(topic_id);
CREATE INDEX idx_tasks_type ON tasks(type);