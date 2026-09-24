.PHONY: help up down db-start db-wait backend-start frontend-start db backend frontend status logs-backend

SHELL := /bin/bash

# Colores y estilos
GREEN  := $(shell tput -Txterm setaf 2 2>/dev/null || echo '')
RED    := $(shell tput -Txterm setaf 1 2>/dev/null || echo '')
YELLOW := $(shell tput -Txterm setaf 3 2>/dev/null || echo '')
BLUE   := $(shell tput -Txterm setaf 4 2>/dev/null || echo '')
BOLD   := $(shell tput -Txterm bold 2>/dev/null || echo '')
RESET  := $(shell tput -Txterm sgr0 2>/dev/null || echo '')

help:
	@echo "$(BLUE)$(BOLD)Comandos de Orquestación PEvolutions:$(RESET)"
	@echo "  $(GREEN)make up$(RESET)             - Levanta DB, Backend y Frontend por fases con validación"
	@echo "  $(GREEN)make down$(RESET)           - Detiene absolutamente TODO (Frontend, Backend y Base de Datos)"
	@echo "  $(GREEN)make status$(RESET)         - Consulta el estado y salud de cada servicio"
	@echo "  $(GREEN)make db$(RESET)             - Levanta únicamente la Base de Datos"
	@echo "  $(GREEN)make backend$(RESET)        - Levanta únicamente el Backend (FastAPI)"
	@echo "  $(GREEN)make frontend$(RESET)       - Levanta únicamente el Frontend (Astro)"
	@echo "  $(GREEN)make logs-backend$(RESET)  - Muestra los logs en tiempo real del backend"

# ==========================================
# FASE 1: BASE DE DATOS
# ==========================================
db-start:
	@echo "$(YELLOW)[1/3] Verificando / Levantando MariaDB...$(RESET)"
	@if systemctl is-active --quiet mariadb 2>/dev/null; then \
		echo "  $(GREEN)✔ Servicio MariaDB ya está activo.$(RESET)"; \
	else \
		echo "  Solicitando permisos de administrador para iniciar MariaDB..."; \
		if sudo systemctl start mariadb; then \
			echo "  $(GREEN)✔ Servicio MariaDB iniciado con éxito.$(RESET)"; \
		else \
			echo "  $(RED)✖ ERROR: Falló al intentar iniciar el servicio MariaDB.$(RESET)"; \
			exit 1; \
		fi; \
	fi

db-wait: db-start
	@echo "  Comprobando conexión en puerto 3306..."
	@for i in $$(seq 1 15); do \
		if (echo > /dev/tcp/127.0.0.1/3306) 2>/dev/null; then \
			echo "  $(GREEN)✔ Base de datos lista y respondiendo en el puerto 3306.$(RESET)"; \
			exit 0; \
		fi; \
		sleep 1; \
	done; \
	echo "  $(RED)✖ ERROR: La base de datos no respondió en el puerto 3306 después de 15 segundos.$(RESET)"; \
	exit 1

# ==========================================
# FASE 2: BACKEND (FastAPI)
# ==========================================
backend-start:
	@echo "$(YELLOW)[2/3] Verificando / Levantando Backend (FastAPI)...$(RESET)"
	@if (echo > /dev/tcp/127.0.0.1/8000) 2>/dev/null; then \
		echo "  $(GREEN)✔ Backend ya está respondiendo en http://localhost:8000.$(RESET)"; \
	else \
		if [ ! -d "backend/venv" ]; then \
			echo "  $(RED)✖ ERROR: No se encontró el entorno virtual en 'backend/venv'.$(RESET)"; \
			exit 1; \
		fi; \
		cd backend && ./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 & echo $$! > ../.backend.pid; \
		echo "  Esperando a que el backend inicialice..."; \
		for i in $$(seq 1 15); do \
			if (echo > /dev/tcp/127.0.0.1/8000) 2>/dev/null; then \
				echo "  $(GREEN)✔ Backend listo en http://localhost:8000 (Docs: http://localhost:8000/docs)$(RESET)"; \
				exit 0; \
			fi; \
			sleep 1; \
		done; \
		echo "  $(RED)✖ ERROR: El backend no logró iniciar. Revisa los logs ejecutando 'make logs-backend' o 'cat backend.log'$(RESET)"; \
		exit 1; \
	fi

# ==========================================
# FASE 3: FRONTEND (Astro + React)
# ==========================================
frontend-start:
	@echo "$(YELLOW)[3/3] Iniciando Frontend (Astro)...$(RESET)"
	@echo "  $(GREEN)$(BOLD)✔ ¡Todo el entorno está correctamente configurado y listo!$(RESET)"
	@echo "  $(BLUE)→ Backend:  http://localhost:8000$(RESET)"
	@echo "  $(BLUE)→ Frontend: http://localhost:4321$(RESET)"
	@echo "  $(YELLOW)Iniciando servidor de desarrollo frontend (Presiona Ctrl+C para salir)...$(RESET)"
	@cd frontend && npm run dev

# ==========================================
# COMANDO PRINCIPAL: MAKE UP
# ==========================================
up: db-wait backend-start frontend-start

# ==========================================
# COMANDO PRINCIPAL: MAKE DOWN (TODO ABAJO)
# ==========================================
down:
	@echo "$(YELLOW)$(BOLD)Deteniendo todos los servicios del proyecto...$(RESET)"
	@# 1. Detener Frontend
	@echo "  Deteniendo frontend..."
	@pkill -f "astro dev" 2>/dev/null && echo "  $(GREEN)✔ Frontend detenido.$(RESET)" || echo "  Frontend no estaba corriendo."
	@# 2. Detener Backend
	@echo "  Deteniendo backend..."
	@if [ -f .backend.pid ]; then \
		PID=$$(cat .backend.pid); \
		kill $$PID 2>/dev/null && echo "  $(GREEN)✔ Backend detenido (PID $$PID).$(RESET)" || true; \
		rm -f .backend.pid; \
	fi
	@pkill -f "uvicorn app.main:app" 2>/dev/null || true
	@# 3. Detener Base de Datos
	@echo "  Deteniendo MariaDB..."
	@if systemctl is-active --quiet mariadb 2>/dev/null; then \
		if sudo systemctl stop mariadb; then \
			echo "  $(GREEN)✔ MariaDB detenida con éxito.$(RESET)"; \
		else \
			echo "  $(RED)✖ Error deteniendo MariaDB.$(RESET)"; \
		fi; \
	else \
		echo "  MariaDB ya estaba detenida."; \
	fi
	@echo "$(GREEN)$(BOLD)✔ Todos los servicios han sido detenidos por completo.$(RESET)"

# ==========================================
# EJECUCIÓN POR SEPARADO
# ==========================================
db: db-wait
	@echo "$(GREEN)$(BOLD)✔ Base de datos levantada y lista para usar.$(RESET)"

backend: db-wait
	@echo "$(YELLOW)Iniciando Backend en primer plano...$(RESET)"
	@cd backend && ./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend:
	@echo "$(YELLOW)Iniciando Frontend en primer plano...$(RESET)"
	@cd frontend && npm run dev

logs-backend:
	@tail -f backend.log

# ==========================================
# ESTADO DEL SISTEMA
# ==========================================
status:
	@echo "$(BLUE)$(BOLD)=== Estado de Servicios PEvolutions ===$(RESET)"
	@printf "  MariaDB (3306): "
	@if (echo > /dev/tcp/127.0.0.1/3306) 2>/dev/null; then \
		echo "$(GREEN)✔ ACTIVO (Puerto 3306 listo)$(RESET)"; \
	else \
		echo "$(RED)✖ INACTIVO$(RESET)"; \
	fi
	@printf "  Backend (8000): "
	@if (echo > /dev/tcp/127.0.0.1/8000) 2>/dev/null; then \
		echo "$(GREEN)✔ ACTIVO (http://localhost:8000)$(RESET)"; \
	else \
		echo "$(RED)✖ INACTIVO$(RESET)"; \
	fi
	@printf "  Frontend (4321):"
	@if (echo > /dev/tcp/127.0.0.1/4321) 2>/dev/null; then \
		echo "$(GREEN)✔ ACTIVO (http://localhost:4321)$(RESET)"; \
	else \
		echo "$(RED)✖ INACTIVO$(RESET)"; \
	fi
