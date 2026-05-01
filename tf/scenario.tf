# --- These are the parameters that define how the scenario will run.  The values set here will be passed as an environment variable
# to the task that runs in ECS.  The performance scenario should be set up to parse and use these params for things like the
# scenario.duration and worker thread counts.

locals {
    scenario_config = jsonencode({
        duration = 4,
        hostname = "av-qa.nike-e2e.com",
        worker1 = {
            threads = 5,
            rampup = 1,
            subthreads = 3
        }
    })

    scenario_vars = [
        {
            name: "scenario",
            value: local.scenario_config
        },
        {
            name: "unique_id",
            value: var.unique_id
        }
    ]
}
