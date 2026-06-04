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

# Bucket S3
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-test-bucket-for-students"

  depends_on = [docker_container.ministack]
}
