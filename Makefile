docker:
	docker build -t registry.cn-beijing.aliyuncs.com/autoxing/sdk-example:latest .

compile:
	npm run build

clear:
	rm -rf ./dist

docker-image: clear compile docker

local-run:
	docker run -p 9999:80 --rm registry.cn-beijing.aliyuncs.com/autoxing/sdk-example:latest
