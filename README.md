# Todo List Application - Step by Step Guide

## Step 1: Prerequisites Installation

1. Install Go:
   - Visit https://golang.org/dl/
   - Download Go 1.22 or later for your operating system
   - Follow the installation instructions
   - Verify installation: `go version`

2. Install Node.js and npm:
   - Visit https://nodejs.org/
   - Download and install the LTS version
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

3. Install Docker:
   - Visit https://www.docker.com/products/docker-desktop
   - Download and install Docker Desktop
   - Start Docker Desktop
   - Verify installation: `docker --version`

4. Install Wails:
   ```bash
   go install github.com/wailsapp/wails/v2/cmd/wails@latest
   ```

## Step 2: Project Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-list-app
   ```

2. Create project structure:
   ```bash
   mkdir -p frontend/src
   touch app.go main.go
   touch frontend/src/App.jsx frontend/src/App.css
   touch docker-compose.yml Dockerfile init.sql
   ```

3. Copy the provided code files:
   - Copy `app.go` content to `app.go`
   - Copy `docker-compose.yml` content to `docker-compose.yml`
   - Copy `Dockerfile` content to `Dockerfile`
   - Copy `init.sql` content to `init.sql`
   - Copy the React components to `frontend/src/App.jsx`
   - Copy the CSS styles to `frontend/src/App.css`

## Step 3: Database Setup

1. Start PostgreSQL using Docker:
   ```bash
   docker compose up
   ```

2. Verify database is running:
   ```bash
   docker ps
   ```
   You should see a postgres container running

3. Check database logs (optional):
   ```bash
   docker-compose logs db
   ```

## Step 4: Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Return to project root:
   ```bash
   cd ..
   ```

## Step 5: Running the Application

1. Development mode:
   ```bash
   wails dev
   ```
   This will:
   - Start the application
   - Enable hot-reloading
   - Open the application window

2. Build for production:
   ```bash
   wails build
   ```
   The built application will be in `build/bin/`

## Step 6: Using the Application

1. Adding a Task:
   - Enter task title in the input field
   - (Optional) Set due date and time
   - Select priority level (Low, Medium, High)
   - Click "Add" button

2. Managing Tasks:
   - Check the checkbox to mark task as complete
   - Click the delete button to remove a task
   - Tasks are automatically sorted by creation date
   - Completed tasks move to a separate section

3. Task Features:
   - Color-coded priorities
   - Due date display
   - Completion status
   - Delete confirmation

## Common Issues and Solutions

1. Database Connection Error:
   - Ensure Docker is running
   - Check if postgres container is up: `docker ps`
   - Verify connection string in `app.go`

2. Frontend Build Issues:
   - Clear node modules: 
     ```bash
     cd frontend
     rm -rf node_modules
     npm install
     ```

3. Wails Development Issues:
   - Update Wails: `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
   - Clear build cache: `wails clean`

## Development Tips

1. Database Management:
   - Access PostgreSQL:
     ```bash
     docker exec -it <container-id> psql -U postgres -d to_do_tasks
     ```
   - View tables: `\dt`
   - Query tasks: `SELECT * FROM tasks;`

2. Frontend Development:
   - Components are in `frontend/src/`
   - CSS styles in `frontend/src/App.css`
   - Changes in dev mode are live-reloaded

3. Backend Development:
   - Main logic in `app.go`
   - Database operations in Task methods
   - Run `go fmt` before commits

## Cleanup

1. Stop the application:
   - Close the application window
   - Press Ctrl+C in terminal if in dev mode

2. Stop database:
   ```bash
   docker-compose down
   ```

3. Remove database volume (if needed):
   ```bash
   docker-compose down -v
   ```

## Need Help?

1. Check logs:
   - Application: Check terminal output
   - Database: `docker-compose logs db`

2. Common Commands:
   ```bash
   # Restart everything
   docker-compose down
   docker-compose up -d
   wails dev

   # Clean and rebuild
   wails clean
   wails build
   ```

---

Remember to update the database connection string in `app.go` if your PostgreSQL configuration differs from the defaults.