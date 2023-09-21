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

To call the main endpoint

```bash
curl http://localhost
```

To visit [Prometheus](http://localhost:9090/graph).
To visit [Grafana](http://localhost:3005/?orgId=1&from=now-15m&to=now).
