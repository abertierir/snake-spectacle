# Snake Spectacle

This repository contains the Frontend (React + Vite), Backend (FastAPI), and Database (PostgreSQL) for the Snake Spectacle game. 

The entire stack is configured to run effortlessly through Docker Compose.

## 🐳 Quick Start with Docker

You can spin up the full application stack using `docker-compose`. This builds the frontend into a static Nginx server, sets up the backend with `uvicorn`, and boots a `postgres` database seamlessly.

### 1. Build and start the containers
From the root of the project, run:
```bash
docker-compose up --build -d
```
*(Drop the `-d` if you want to keep the logs attached to your terminal).*

### 2. Available Services & Ports

Once the containers are successfully running, the services will be mapped to the following ports on your host machine / Codespace:

| Service | Container Name | Local Port | Access URL | Description |
|---|---|---|---|---|
| **Frontend** | `snake-spectacle-frontend-1` | `3000` | `http://localhost:3000` | The main game view. Nginx serves the static React application here. |
| **Backend** | `snake-spectacle-backend-1` | `8000` | `http://localhost:8000` | The FastAPI server. You can view the API Swagger UI docs at `http://localhost:8000/docs`. |
| **Database** | `snake-spectacle-db-1` | `5432` | `localhost:5432` | The PostgreSQL database. It is exposed to the host for manual queries if needed (User/Pass: `postgres`/`postgrespassword`). |

> **⚠️ Note for Codespaces/Remote Environments:**
> If you're running this in a cloud IDE like GitHub Codespaces, ensure that port **3000** is forwarded and set to **Public** visibility if you cannot see the frontend browser preview. If you only forward port 8000, you will only see the raw backend API!
>
> If you click the built-in "Ports" tab at the bottom panel of your IDE, you should see port `3000`, `8000`, and `5432` listed. Click the globe/link icon next to port **3000** to see the frontend.

## 🛠️ Viewing Logs and Status

To check if all containers are running successfully:
```bash
docker-compose ps
```

To view the logs for a specific service (e.g., to see database initialization or backend errors):
```bash
# View logs for all services
docker-compose logs -f

# View logs exclusively for the frontend
docker-compose logs -f frontend

# View logs exclusively for the backend
docker-compose logs -f backend

# View logs exclusively for postgres
docker-compose logs -f db
```

## 🛑 Stopping the Stack

To stop the running application without deleting your database data:
```bash
docker-compose stop
```

To completely tear down the containers and **wipe the database** (removing the volumes):
```bash
docker-compose down -v
```

## 🏗️ Architecture Note

- The **Frontend** uses `nginx` to serve the compiled application. In its configuration (`frontend/nginx.conf`), it proxy-passes any request prefixed with `/api/` directly to the Backend service. Thus, you only need to interact with the frontend on port `3000`; the frontend securely tunnels your API interactions inside the docker network.
