README
======

You'll need a couple of things installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [K6](https://k6.io/docs/)
- [awk](https://www.gnu.org/software/gawk/manual/gawk.html)
- [jq](https://jqlang.github.io/jq/)
- [Node](https://nodejs.org/en)

You will need to install dependencies in the `src` folder

```bash
# via npm
npm i 

# via yarn
yarn install
```

Then you can build & run the project via `docker compose`

```bash
docker-compose down -v && docker-compose up --build --remove-orphans
```

To call the only endpoint in the server:

```bash
curl --request POST http://localhost/server/create
```

To run the load test, edit `loadtest.js` to whichever `target` and `duration` you want, and then:

```bash
./loadtest.sh
```

This will run each test `N=5` times and aggregate the results. 

It will output:
- Maximum requests per second
- Average requests per second
- Average latency
- Median latency
- P90 latency
- P95 latency
- Failure rate

As well as a history of % CPU and % Memory usage for the App Server (`crud-server`) and Database (`crud-db`).