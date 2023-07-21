Chatper 1
=========

Story
-----
We start by creating a simple static website & serve it with Docker & Nginx; 
we use autocannon to load test it to begin to get an understanding of how it scales.


Conclusion
----------

static websites can scale a lot; if content does not change & is easy to present, thousands of rps can be easily 
achieved on cheap hardware; if you add (Nginx) caching, it’s even better; 
there are 10s of services out there that help you, mostly for free (Cloudflare, etc) or you can roll your own easily.

To run
-------

Scenario #1

```bash
docker build -t chapter-1-scrnario-1-app . && docker run -p 80:80 chapter-1-scrnario-1-app
```

Result: at **4096** rps, about 7-10% of requests fail bc of nginx not being able to handle thing.

Scenario #2

Try 1:
Running the docker container like this - no change in ability to handle requests.

```bash
docker build -t chapter-1-scrnario-2-app . && docker run --ulimit nofile=65535:65535 -p 80:80 chapter-1-scrnario-2-app
```

Try 2:
However, running w/o `--ulimit nofile=65535:65535` but increasing `worker_connections 65535;` yields good resuts at **4096**. 
At **16384** rps, even just increasing the worker connections get us a 2.35% failure rate. We also get 100+% CPU usage on one core. 

Try 3: 
Adding `use epoll;` to see what happens. Still the same limit. 

Try 4:
Adding `epoll_events 512;` to see what happens. Still the same limit. 

Try 5:
Adding `worker_processes auto;` and `worker_rlimit_nofile 65535;` to see what happens. Still the same limit;

Try 6: 
Adding a lot of changes to the `http` part of the server to see what happens. Still the same limit, but seems like the failure rate might be a bit lower;

Try 7:
Adding back `--ulimit nofile=65535:65535`. No change as well. With current knowledge, this is probably a device limit.
