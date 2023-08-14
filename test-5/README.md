README
======

You'll need a couple of things installed:

- [Docker](https://www.docker.com/)
- [K6](https://k6.io/docs/)
- [awk](https://www.gnu.org/software/gawk/manual/gawk.html)
- [jq](https://jqlang.github.io/jq/)

You can build the project from the `src` folder

```bash
docker-compose up --build --remove-orphans
```

and you can run it via

```bash
docker run --name my-server --cpus="1.0" --memory="0.2g" -p 80:3000 my-server
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

As well as a history of % CPU and % Memory usage.