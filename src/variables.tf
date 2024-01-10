variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "The AWS region into which resources will be installed."
}

variable "environment" {
  type        = string
  default     = "sandbox"
  description = "The environment (sandbox, dev, staging or prod) associated with the AWS account."
}

variable "lambda_name" {
  type        = string
  default     = "expand-teams-taylor-test"
  description = "The name of the lambda function"
}

variable "image_name" {
  type        = string
  default     = "expand-teams-taylor-test"
  description = "The name of the lambda container image/ECR repository"
}

variable "image_version" {
  type        = string
  default     = "latest"
  description = "The image version tag"
  validation {
    condition     = var.image_version == regex("^v[0-9]+\\.[0-9]+\\.[0-9]+$", var.image_version)
    error_message = "The image_version tag should be in the form \"vx.y.z\", where x, y, z are numbers."
  }
}