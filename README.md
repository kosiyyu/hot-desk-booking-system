# Hot desk booking system

> Author: Karol Koś

## 1. Introduction
Application is composed of three main components:

- A React frontend application
- An ASP.NET Core backend application
- A PostgreSQL database

All components are containerized and run within Docker.

## 2. How to Run

### Building and Running the Project
To build and run the project using Docker, execute the following command:

```
docker compose -f docker-compose-example.yml -p hdbs_example up -d --build
```

To access it use **http://localhost:5173/**

This command will build the necessary Docker images and start the containers in detached mode.

### Stopping and Removing the Project
To stop and remove all containers, networks, and volumes associated with this project, use:

```
docker compose -f docker-compose-example.yml -p hdbs_example down -v
```

## 3. Admin Credentials
Use the following credentials to access the admin panel:

- **Email:** `admin@example.com`
- **Password:** `12345678`