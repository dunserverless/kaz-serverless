.PHONY: deploy destroy int envvars creds seed region

export AWS_REGION := eu-west-1  

deploy:
	cdk deploy --all --profile sand --context stageName=kazza

destroy:
	cdk destroy --all --profile sand --context stageName=kazza

int:
	AWS_REGION=eu-west-1 npm run test

e2e:
	AWS_REGION=eu-west-1 npm run test:e2e

envvars:
	./export-env.sh ApiStack-kazza eu-west-1

creds:
	aws sso login --profile sand && \
	eval $(aws-sso-creds export -p sand)

seed:
	node seed-restaurants.js
