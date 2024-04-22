#!/usr/bin/env make

.SILENT:

install-deps:
	docker compose run --rm --build nodejs-cli npm install

cli:
	docker compose run --rm nodejs-cli sh
