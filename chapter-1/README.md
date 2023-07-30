README
======

You'll need a couple of things installed:

- [Docker](https://www.docker.com/)
- [K6](https://k6.io/docs/)
- [awk](https://www.gnu.org/software/gawk/manual/gawk.html)
- [jq](https://jqlang.github.io/jq/)

You can build the project from the `src` folder

```bash
docker build -t my-blog .
```

and you can run it via

```bash
docker run --name my-blog --cpus="1.0" --memory="0.2g" -p 80:80 my-blog
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

```bash
----------------
Max rps		      4096.00
Avg rps		      2034.00
Average latency	  5.73
Median latency	  4.71
P90 latency	      10.31
P95 latency	      12.92
Failure rate	  0.00%
----------------  
Time	CPU (%)
0	    4.21
1	    14.00
2	    21.53
3	    24.98
4	    33.25
5	    42.05
6	    48.84
7	    49.19
----------------
Time	Mem (%)
0	    33.08
1	    33.38
2	    33.76
3	    34.00
4	    34.29
5	    34.55
6	    34.83
7	    34.54
```