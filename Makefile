.PHONY: deploy destroy int envvars creds seed

deploy:
	cdk deploy --all --profile sand --context stageName=kazza-dev

destroy:
	cdk destroy --all --profile sand --context stageName=kazza-dev

int:
	AWS_REGION=eu-west-1 npm run test

e2e:
	AWS_REGION=eu-west-1 npm run test:e2e

envvars:
	./export-env.sh ApiStack-kazza-dev eu-west-1

creds:
	aws sso login --profile sand

seed:
	node seed-restaurants.js
