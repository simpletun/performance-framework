# vars -------------------------------------------------------------------------
terraform {
  required_version = "~> 1.3.9"
  required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 4.0"
        }
    }
  backend "s3" {  }
}

# aws --------------------------------------------------------------------------
provider "aws" {
  ignore_tags {
    keys = ["Product", "costcenter", "nike-department", "nike-distributionlist", "nike-domain", "nike-owner", "projectcode", "nike-application", "nike-environment"]
  }
}

variable "app" {
  default = "perf-framework"
}

variable "env" {
  default = "qa"
}

variable "image_name" {
}

variable "scenario" {
}

variable "runModeString" {
  default = "output:newrelic"
}

variable "unique_id" {
  default = 1
}