data "aws_caller_identity" "current" {}

data "aws_ecr_repository" "expand_teams_app" {
  name = var.image_name
}

data "aws_iam_role" "lambda_role" {
  name = "expand-teams-taylor-test-lambda-role"
}