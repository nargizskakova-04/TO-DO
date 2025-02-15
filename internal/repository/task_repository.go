package repository

import (
	"database/sql"
	"todo/internal/models"
)

type TaskRepository struct {
	db *sql.DB
}

func NewTaskRepository(db *sql.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) CreateTask(task *models.Task) error {
	query := `
        INSERT INTO tasks (title, done, created_at, due_date, priority)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`

	return r.db.QueryRow(
		query,
		task.Title,
		task.Done,
		task.CreatedAt,
		task.DueDate,
		task.Priority,
	).Scan(&task.ID)
}

func (r *TaskRepository) GetAllTasks() ([]models.Task, error) {
	query := `SELECT id, title, done, created_at, due_date, priority FROM tasks ORDER BY created_at DESC`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []models.Task
	for rows.Next() {
		var task models.Task
		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Done,
			&task.CreatedAt,
			&task.DueDate,
			&task.Priority,
		)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	return tasks, nil
}
