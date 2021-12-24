#!/bin/sh

if [ -z $GRAFANA_API_KEY ];
then
    echo "No promtail file, no logs will be sent to the aggregator."
else
    echo "Using promtail to aggregate logs."
    (
        cd /etc/promtail/ &&
        envsubst > config.yaml < config.yaml.template &&
        promtail -config.file config.yaml
    ) >/var/log/promtail.log 2>&1 &
    (
        cd /etc/carbon-relay-ng/ &&
        envsubst > config.ini < config.ini.template &&
        carbon-relay-ng config.ini
    ) >/var/log/carbon-relay-ng.log 2>&1 &

    # Wait for aggregators to send the logs at the end
    trap 'sleep 5' EXIT
fi

$@
