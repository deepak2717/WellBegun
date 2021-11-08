resources:
  limits:
    memory: 2048Mi
  requests:
    cpu: 1000m
    memory: 1024Mi

cronjob:
  schedule: "0 0 31 2 *" # Never run on schedule, will only be triggered manually

