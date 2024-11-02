# kanban-boards

Este repositorio es para automatizar el despliegue de planka intentando evitar hacer un fork del repositorio original.

## Front env variables

```sh
NODE_ENV=production
BASE_URL=http://localhost:3000
```

## Construir build

- Ir al otro repositorio (`../planka`)
- `nvm use 18`
- `npm ci`
- `npm run client:build`

## Desplegar

### Env vars

```sh
export AWS_DEFAULT_REGION='us-east-1'
export AWS_PROFILE='boxie-prod'
export STACK_NAME='planka-boards'
export HOSTED_ZONE_ID_PROD='Z03850243JY72J8U3JMYU'
export WEBSITE_BUCKET='undefined'
export CLOUDFRONT_DISTRIBUTION_ID='undefined'

echo \
  $AWS_PROFILE \
  $STACK_NAME \
  $HOSTED_ZONE_ID_PROD \
  $WEBSITE_BUCKET \
  $CLOUDFRONT_DISTRIBUTION_ID
```

### Deploy infra

```sh
sam build --template planka-front-sam-template.yml
sam package --resolve-s3
sam deploy \
  --no-fail-on-empty-changeset \
  --stack-name $STACK_NAME \
  --resolve-s3 \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    env=prod \
    HostedZoneIdProd=$HOSTED_ZONE_ID_PROD
```

### Get infra output

```sh
aws cloudformation describe-stacks --stack-name $STACK_NAME > stack.json
node parse-cloudformation-output-as-env.js stack.json > stack.env
source stack.env
```

### Copy files to bucket

```sh
export BUILD_LOCAL_ROUTE='../planka/client/build'
echo \
  $BUILD_LOCAL_ROUTE \
  $STATIC_SITE_BUCKET

aws s3 sync $BUILD_LOCAL_ROUTE s3://$STATIC_SITE_BUCKET --only-show-errors
aws s3 sync ./upload s3://$STATIC_SITE_BUCKET --only-show-errors
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
```
