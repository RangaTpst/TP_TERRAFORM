#!/bin/sh

DATE=${1:-$(date +%Y-%m-%d)}
ENDPOINT="http://host.docker.internal:4566"
BUCKET="my-test-bucket-for-students"

echo "Restore du $DATE..."

aws --endpoint-url=$ENDPOINT s3 cp s3://$BUCKET/backups/$DATE/terraform.tfstate /data/terraform/terraform.tfstate

echo "Restore terminé."
