package main

import (
    "context"
    "database/sql"
    "fmt"
    "time"
    _ "github.com/lib/pq"
)

type Task struct {
    ID        int64      `json:"id"`
    Title     string     `json:"title"`
    Done      bool       `json:"done"`
    CreatedAt time.Time  `json:"created_at"`
    DueDate   *time.Time `json:"due_date,omitempty"`
    Priority  int        `json:"priority"`
}

type App struct {
    ctx  context.Context
    db   *sql.DB
}

func NewApp() *App {
    return &App{}
}

func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
    
    connStr := "host=localhost port=5432 user=postgres password=postgres dbname=to_do_tasks sslmode=disable"
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        fmt.Printf("Error connecting to database: %v\n", err)
        return
    }
    
    a.db = db
}

func (a *App) AddTask(task Task) error {
    query := `
        INSERT INTO tasks (title, done, created_at, due_date, priority)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`
    
    return a.db.QueryRow(
        query,
        task.Title,
        task.Done,
        task.CreatedAt,
        task.DueDate,
        task.Priority,
    ).Scan(&task.ID)
}

func (a *App) GetTasks() ([]Task, error) {
    query := `SELECT id, title, done, created_at, due_date, priority FROM tasks ORDER BY created_at DESC`
    
    rows, err := a.db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var tasks []Task
    for rows.Next() {
        var task Task
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

func (a *App) ToggleTask(id int64) error {
    query := `UPDATE tasks SET done = NOT done WHERE id = $1`
    _, err := a.db.Exec(query, id)
    return err
}

func (a *App) DeleteTask(id int64) error {
    query := `DELETE FROM tasks WHERE id = $1`
    _, err := a.db.Exec(query, id)
    return err
}