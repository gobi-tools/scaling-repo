#!/bin/bash

LOAD_TEST=$1
CPU_FILE=load_test_result/cpu_$LOAD_TEST.txt
MEM_FILE=load_test_result/mem_$LOAD_TEST.txt

iteration=0
while [ true ]; do
  # obtain only the current % CPU usage for container "my-server"  
  cpu_perc=$(docker stats --format "{{.CPUPerc}}" --no-stream my-server)

  # obtain only the current % Memory usage for container "my-server"  
  mem_perc=$(docker stats --format "{{.MemPerc}}" --no-stream my-server)
  
  # print the result
  echo $iteration $cpu_perc >> $CPU_FILE
  echo $iteration $mem_perc >> $MEM_FILE
  ((iteration++))
done


