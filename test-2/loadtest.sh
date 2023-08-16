#!/bin/bash

# prepare
rm -rf load_test_result
mkdir load_test_result

# Number of times to repeat the test
N=5
SERVER_CONTAINER=crud-server
DB_CONTAINER=crud-db

############################################
# Run the actual experiment
############################################

# Run the k6 test N times
for ((i=1; i<=N; i++)); do
  echo "Running test iteration $i"

  echo "Start CPU & Mem monitoring"
  # start monitoring the first container, "crud-server" in the BG
  ./monitor.sh $i $SERVER_CONTAINER &
  # get the pid
  script_1_pid=$!

  # start monitoring the first container, "crud-server" in the BG
  ./monitor.sh $i $DB_CONTAINER &
  # get the pid
  script_2_pid=$!
  
  echo "Start load test"
  # run k6
  k6 run --summary-trend-stats="avg,med,p(90),p(95)" loadtest.js
  mv summary.json load_test_result/summary_$i.json

  # stop the monitoring pid
  kill $script_1_pid
  kill $script_2_pid
done

############################################
# Calc avg latencies
############################################

# Function to calculate the average of an array of numbers using awk
function calculate_average {
  awk '{ sum += $1 } END { printf "%.2f", sum / NR }'
}

function extract_value {
  jq -r ".$2" "$1"
}

# Initialize arrays to hold the "med" and "p90" values
avg_values=()
med_values=()
p90_values=()
p95_values=()

rps_max_values=()
rps_avg_values=()

failure_values=()

# Loop through the JSON files and extract the values
for ((i=1; i<=N; i++)); do
  filename="load_test_result/summary_$i.json"

  values=$(extract_value "$filename" "latency.avg")
  avg_values+=($(echo "$values" | awk '{print $1}'))

  values=$(extract_value "$filename" "latency.med")
  med_values+=($(echo "$values" | awk '{print $1}'))

  values=$(extract_value "$filename" "latency.p90")
  p90_values+=($(echo "$values" | awk '{print $1}'))

  values=$(extract_value "$filename" "latency.p95")
  p95_values+=($(echo "$values" | awk '{print $1}'))

  values=$(extract_value "$filename" "rps.max")
  rps_max_values+=($(echo "$values" | awk '{print $1}'))

  values=$(extract_value "$filename" "rps.avg")
  rps_avg_values+=($(echo "$values" | awk '{print $1}'))

  values=$(extract_value "$filename" "rps.failure")
  failure_values+=($(echo "$values" | awk '{print $1}'))
done

# Calculate the total averages
avg_average=$(printf '%s\n' "${avg_values[@]}" | calculate_average)
med_average=$(printf '%s\n' "${med_values[@]}" | calculate_average)
p90_average=$(printf '%s\n' "${p90_values[@]}" | calculate_average)
p95_average=$(printf '%s\n' "${p95_values[@]}" | calculate_average)
rps_max_average=$(printf '%s\n' "${rps_max_values[@]}" | calculate_average)
rps_avg_average=$(printf '%s\n' "${rps_avg_values[@]}" | calculate_average)
failure_rate=$(printf '%s\n' "${failure_values[@]}" | calculate_average)

# Print results
echo "--------------------------------"
echo -e "Max rps\\t\\t" $rps_max_average
echo -e "Avg rps\\t\\t" $rps_avg_average

echo -e "Average latency\\t" $avg_average
echo -e "Median latency\\t" $med_average
echo -e "P90 latency\\t" $p90_average
echo -e "P95 latency\\t" $p95_average
echo -e "Failure rate\\t" $failure_rate"%"
echo "--------------------------------"

############################################
# Calc CPU & Mem usage
############################################

function calc_average_data {
  file=$1
  container=$2

  # Function to get the number of lines in a file
  function count_lines {
    wc -l < "$1"
  }

  # Initialize min_lines with a large number to start (larger than the expected M)
  min_lines=9999999

  # Loop through the files and find the minimum number of lines
  for ((i=1; i<=N; i++)); do
    filename="load_test_result/"$file"_"$container"_"$i".txt"
    lines=$(count_lines "$filename")
    
    # Check if the current file has fewer lines than the current minimum
    if ((lines < min_lines)); then
      min_lines=$lines
    fi
  done

  # Subtract 1 from min_lines
  (( min_lines-- ))

  # Loop through the timestamps (1 to 14)
  for ((timestamp=0; timestamp<=$min_lines; timestamp++)); do
    total_percentage=0

    # Loop through the files and extract the percentage value for the current timestamp
    for ((i=1; i<=N; i++)); do
      filename="load_test_result/"$file"_"$container"_"$i".txt"
      percentage=$(awk -v ts="$timestamp" '$1 == ts { gsub(/%/, "", $2); print $2 }' "$filename")
      total_percentage=$(echo "$total_percentage + $percentage" | bc)
    done

    # Calculate the average percentage for the current timestamp
    average_percentage=$(echo "scale=2; $total_percentage / $N" | bc)

    # Format the average percentage to include leading zero (e.g., 0.3 instead of .3)
    formatted_percentage=$(printf "%.2f" $average_percentage)

    echo -e "$container\\t$timestamp\\t$formatted_percentage"
  done
}

echo -e "Container\\tTime\\tCPU (%)"
calc_average_data "cpu" $SERVER_CONTAINER
echo "--------------------------------"
echo -e "Container\\tTime\\tMem (%)"
calc_average_data "mem" $SERVER_CONTAINER
echo "--------------------------------"

echo -e "Container\\tTime\\tCPU (%)"
calc_average_data "cpu" $DB_CONTAINER
echo "--------------------------------"
echo -e "Container\\tTime\\tMem (%)"
calc_average_data "mem" $DB_CONTAINER

############################################
# Tear down
############################################

prepare
rm -rf load_test_result
