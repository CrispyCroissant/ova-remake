build:
	cp -r ../shared ./ 
	docker compose build
	rm -rf shared
	
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --remove-orphans
dev-v:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --remove-orphans

start:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --remove-orphans

stop:
	docker compose down