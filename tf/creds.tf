# --- Secrets must be defined in this way for ECS container definitions.  These are references to parameter store keys and will be
# fetched by the containers at startup. If these keys were in a different account, they would need to be full arn refs.
# Ref: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-ssm-paramstore.html

locals {
  secret_vars = [
    {
      name: "autoPass",
      valueFrom: "/av/sensitive/av_automation_pass"
    },
    {
      name: "oktaClientSecret",
      valueFrom: "/av/sensitive/okta_test_secret"
    },
    {
      name: "dbPass",
      valueFrom: "/av/sensitive/av_aurora_rw_pass"
    }
  ]
}
