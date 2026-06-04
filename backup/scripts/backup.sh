#!/bin/sh

DATE=$(date +%Y-%m-%d)
ENDPOINT="http://host.docker.internal:4566"
BUCKET_HOT="bucket-hot"
BUCKET_COLD="bucket-cold"

echo "Backup du $DATE..."

# Backup Terraform state vers S3
aws --endpoint-url=$ENDPOINT s3 cp /data/terraform/terraform.tfstate s3://$BUCKET_COLD/backups/$DATE/terraform.tfstate

# Réplication bucket chaud -> bucket froid
aws --endpoint-url=$ENDPOINT s3 sync s3://$BUCKET_HOT s3://$BUCKET_COLD/files/

echo "Backup terminé."
