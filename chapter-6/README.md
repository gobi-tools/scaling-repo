README
======

To install dependencies locally:

```bash
# via npm
npm i 

# via yarn
yarn install
```

To run via `docker compose`

```bash
docker-compose down -v && docker-compose up --build --remove-orphans
```

```bash
# machine cores
machine_cpu_cores

# machine memory
machine_memory_bytes

# % CPU Usage by Container
rate(container_cpu_usage_seconds_total{name='app-server'}[1m]) # better ?
avg(rate(container_cpu_usage_seconds_total{name='app-server'}[1m])) by (name) * 100 # better still?

avg(rate(container_cpu_usage_seconds_total{image='microservice-arch-2_app-server', name!="app-server"}[1m])) by (name) * 100

# memory usage by Container
avg(container_memory_usage_bytes{image='microservice-arch-2_app-server', name!="app-server"}) by (name)
# used by container (50MB)
container_memory_usage_bytes
# limit (200MB)
container_spec_memory_limit_bytes

# number of running containers
sum(rate(container_last_seen{image="microservice-arch-2_app-server"}[1m]))
```