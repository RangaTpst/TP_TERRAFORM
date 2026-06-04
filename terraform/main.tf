terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true

  endpoints {
    s3 = "http://localhost:4566"
  }
}

provider "docker" {}

# MiniStack
resource "docker_image" "ministack" {
  name = "ministackorg/ministack"
}

resource "docker_container" "ministack" {
  name  = "ministack"
  image = docker_image.ministack.image_id

  ports {
    internal = 4566
    external = 4566
  }
}

# Bucket principal (chaud)
resource "aws_s3_bucket" "bucket_hot" {
  bucket = "bucket-hot"

  depends_on = [docker_container.ministack]
}

# Bucket froid (archive/backup)
resource "aws_s3_bucket" "bucket_cold" {
  bucket = "bucket-cold"

  depends_on = [docker_container.ministack]
}

# Outputs
output "bucket_hot_name" {
  value = aws_s3_bucket.bucket_hot.bucket
}

output "bucket_cold_name" {
  value = aws_s3_bucket.bucket_cold.bucket
}

output "s3_endpoint" {
  value = "http://localhost:4566"
}

output "s3_region" {
  value = "us-east-1"
}
