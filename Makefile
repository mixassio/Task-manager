install:
	npm install
start:
	npm run nodemon -- --exec babel-node bin/server.js
lint:
	npx eslint .
publish:
	npm publish
test:
	npm test -s
test-debug:
	DEBUG=page-loader:* npm test
watch:
	npm run watch
.PHONY: test