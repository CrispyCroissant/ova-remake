build:
	cp -r ../shared ./ 
	docker compose build
	rm -rf shared
	
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
dev-v:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

start:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

stop:
	docker compose down