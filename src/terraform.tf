terraform {
  required_version = "~> 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.22"
    }
  }

  cloud {
    organization = "hyland-cloud-delivery"

    workspaces {
      tags = ["purpose:expand-teams-github-app"]
    }
  }
}
