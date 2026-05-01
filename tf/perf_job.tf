# Module Import
module "av_constants" {
  source = "git::ssh://git@github.com/nike-assort-visual/av-terraform-modules//ecs-cluster-constants"
}

module "lpm_one_time_task" {
  source                    = "git::ssh://git@github.com/nike-foundation/terraform-modules//ecs-one-time-task"
  cpu_limit                 = 512
  mem_limit                 = 1024
  app_suite                 = "av"              // used primarily for log grouping
  app_env                   = "${var.app}-${var.scenario}"
  image_name                = var.image_name
  env_vars                  = local.scenario_vars
  secret_vars               = local.secret_vars
  ecs_one_time_task_count   = 1
  container_command         = ["npm", "start", var.scenario, var.runModeString]

  # lookups
  ecs_execution_role_arn    = module.av_constants.ecs_cluster_lookups[var.env].ecs_execution_role_arn
  ecs_task_role_arn         = module.av_constants.ecs_cluster_lookups[var.env].ecs_task_role_arn
  ecs_cluster_arn           = module.av_constants.ecs_cluster_lookups[var.env].ecs_cluster_arn
  ecs_service_subnet_list   = module.av_constants.ecs_cluster_lookups[var.env].ecs_service_subnet_list
  ecs_service_sg_list       = module.av_constants.ecs_cluster_lookups[var.env].ecs_service_sg_list
}
