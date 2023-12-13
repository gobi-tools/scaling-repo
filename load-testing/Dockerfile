# Use an official Node runtime as a base image
FROM grafana/k6

# Set the working directory to /app
WORKDIR /srv

# Copy the current directory contents into the container at /app
COPY loadtest.js loadtest.js

# Set empty entrypoint
ENTRYPOINT [ "" ]

# Run k6 when the container launches
CMD ["k6", "run", "loadtest.js"]
