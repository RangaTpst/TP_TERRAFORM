#!/bin/sh

DATE=$(date +%Y-%m-%d)
ENDPOINT="http://host.docker.internal:4566"
BUCKET="my-test-bucket-for-students"

echo "Backup du $DATE..."

# Backup Terraform state
aws --endpoint-url=$ENDPOINT s3 cp /data/terraform/terraform.tfstate s3://$BUCKET/backups/$DATE/terraform.tfstate

echo "Backup terminé."
