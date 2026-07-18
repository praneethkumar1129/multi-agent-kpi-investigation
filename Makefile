COMPOSE         := docker compose
COMPOSE_PROD    := docker compose -f docker-compose.yml -f docker-compose.override.yml
BUILDKIT_ENV    := DOCKER_BUILDKIT=1 COMPOSE_DOCKER_CLI_BUILD=1

.PHONY: build up down logs clean rebuild ps shell-backend shell-frontend

## Build all images
build:
	$(BUILDKIT_ENV) $(COMPOSE) build --parallel

## Start all services (detached)
up:
	$(BUILDKIT_ENV) $(COMPOSE) up -d

## Stop and remove containers
down:
	$(COMPOSE) down

## Tail logs for all services (Ctrl-C to exit)
logs:
	$(COMPOSE) logs -f

## Remove containers, images, volumes, and orphans
clean:
	$(COMPOSE) down --rmi all --volumes --remove-orphans

## Rebuild images from scratch and restart
rebuild:
	$(BUILDKIT_ENV) $(COMPOSE) build --no-cache --parallel
	$(COMPOSE) up -d

## Show running containers
ps:
	$(COMPOSE) ps

## Open a shell in the backend container
shell-backend:
	$(COMPOSE) exec backend sh

## Open a shell in the frontend container
shell-frontend:
	$(COMPOSE) exec frontend sh

## Production: build + start with override
prod-up:
	$(BUILDKIT_ENV) $(COMPOSE_PROD) up -d --build

## Production: stop
prod-down:
	$(COMPOSE_PROD) down
