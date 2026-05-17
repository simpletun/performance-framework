# AGENTS.md — performance-framework

## Purpose

This is an **example project** demonstrating how to build a performance testing tool using the `cluster-load-runner` library. It can be cloned and adapted to load test any HTTP API by updating the scenarios and workers to match the target system.

The framework drives configurable concurrent load against endpoints, measures response times and throughput, and can export results to CSV, New Relic, or InfluxDB.

The repo is typically used as an **orphaned branch** inside a service's own repo (named `performance`) rather than as a standalone project. Do not merge a performance branch back into the service's main branch.

---

## How It Works

The framework is built around three concepts:

**Scenarios** — configuration files in `scenarios/` that describe the shape of a load test: duration, target server, thread counts, ramp-up behavior, data providers, and which workers to use.

**Workers** — modules in `src/workers/` that execute the actual work (HTTP requests, DB queries, file reads, etc.). Each worker runs in its own cluster process. Workers can spawn sub-threads for additional concurrency.

**Providers** — special workers that supply data to other workers (e.g., reading endpoint paths from a CSV file and handing lines to HTTP workers on demand).

The entry point (`src/start.js`) delegates to the `cluster-load-runner` library, which manages the master process, worker cluster, IPC, metrics collection, and output.

---

## Project Structure

```
src/
  start.js                    # Entry point — delegates to cluster-load-runner
  workers/
    reference-example.js      # HTTP GET worker (primary example)
    mysql-example.js          # MySQL query worker
    file-example.js           # File reader worker
    threadwriter-example.js   # Sends messages to another worker group
    threadreader-example.js   # Receives messages from another worker group

scenarios/
  reference-example.js        # HTTP load test scenario (primary example)
  mysqlExample.js             # Database load test
  fileExample.js              # File I/O load test
  thread-message-example.js   # Inter-process communication demo

docs/
  index.html                  # Full framework reference documentation
```

---

## Running a Load Test

```bash
npm install
npm start <scenario-name> [run-mode-flags]
```

Examples:
```bash
npm start reference-example
npm start reference-example log:debug output:newrelic
npm start fileExample
```

Run-mode flags:
- `log:debug` — verbose logging to stdout
- `output:newrelic` — stream metrics to New Relic
- `output:influxdb` — stream metrics to InfluxDB
- (default) — write results to CSV in the reports directory

Clean generated artifacts (reports, coverage, tmp):
```bash
npm run clean
```

---

## Writing a New Scenario

A scenario file exports a default object with three keys:

```js
export default { scenario, providers, workers };
```

- **`scenario`** — global settings, primarily `{ duration }` in milliseconds
- **`providers`** — array of data provider worker configs (e.g., a `file-data-provider` that reads a CSV)
- **`workers`** — array of load worker configs, each specifying `workerType`, thread counts, `subThreads`, think time, target server, and any custom config

Use `evenRampUp(targetThreads, rampDuration)` from `cluster-load-runner` to gradually increase concurrency rather than slamming all threads at once.

The scenario JSON can also be injected via the `scenario` environment variable (parsed at runtime), which is useful for parameterizing containerized deployments.

---

## Writing a New Worker

A worker module uses imports from `cluster-load-runner`:

```js
import { sleep, makeRequest, logger, randomNumberFrom,
         FileReadMessenger, config, shutdown, onMessage } from 'cluster-load-runner';
```

Key patterns:
- `onMessage('start', async () => { ... })` — fires when the master starts the test; spawn sub-threads here
- `onMessage('stop', () => { shutdown(); })` — fires when the test ends
- `config` — contains the worker's config object from the scenario file (`config.subThreads`, `config.server`, etc.)
- `makeRequest({ transactionName, requestConfig })` — the primary HTTP call; records timing automatically
- `FileReadMessenger` — IPC client to request lines from a file provider worker
- `sleep(ms)` — async sleep; use with `randomNumberFrom(from, to)` for think time

The worker at [src/workers/reference-example.js](src/workers/reference-example.js) is the canonical example to follow.

---

## Containerized Deployment

Docker (local):
```bash
docker build -f ./Dockerfile --force-rm -t local/performance-framework .
docker run --rm -it \
  --mount type=bind,source="$(pwd)"/secrets,target=/app/secrets \
  --name performance-framework local/performance-framework
```

---

## Key Dependencies

| Package | Role |
|---|---|
| `cluster-load-runner` | Core load testing engine |
| `follow-redirects` | HTTP client with redirect support |
| `winston` / `winston-cluster` | Cluster-aware logging |
| `node-mysql` | MySQL connections for DB workers |
| `csv-stringify` | CSV output for results |
| `ws` | WebSocket support |

---

## External Service Dependencies

- **New Relic** — optional output target for metrics (`output:newrelic` flag)
- **InfluxDB** — optional output target for metrics (`output:influxdb` flag)
- **Aurora MySQL** — used in DB worker scenarios

---

## Full Documentation

The HTML reference docs are in [docs/index.html](docs/index.html) and cover all `cluster-load-runner` exports, worker lifecycle events, output formats, run-mode flags, and provider configuration options.
