module "lambda_function_container_image" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = var.lambda_name
  description   = "GitHub App for requesting individual team member reviews"

  create_package = false

  image_uri    = "${data.aws_ecr_repository.expand_teams_app.repository_url}:${var.image_version}"
  package_type = "Image"

  create_role = false
  lambda_role = data.aws_iam_role.lambda_role.arn

  create_lambda_function_url = true
  authorization_type         = "NONE"

  timeout = 10
}