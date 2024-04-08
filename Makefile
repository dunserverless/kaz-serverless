.PHONY: deploy destroy int envvars creds seed

deploy:
	cdk deploy --all --profile sand --context stageName=kazza

destroy:
	cdk destroy --all --profile sand --context stageName=kazza

int:
	npm run test

envvars:
	./export-env.sh ApiStack-kazza eu-west-1

creds:
	aws sso login --profile sand
	eval $(aws-sso-creds export -p sand)

seed:
	node seed-restaurants.js

