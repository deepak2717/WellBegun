# https://talon.static.corp.creditkarma.com/repos/ck-private/fwk_talon-scala/misc-docs/deploy-docs/ServiceSettings/#valuesyml
# How many instances to run
service:
  replicaCount: 1

# env and consulKeys are passed to docker container as ENVIRONMENT
# Environment variables used by the Talon Framework and the JVM
env:
  - name: JAVA_OPTS
    value: >-
      -Xmx1024m
      -Xms1024m
      -XX:+UseG1GC
      -XX:MaxGCPauseMillis=100
      -XX:+ExitOnOutOfMemoryError
      -Dzipkin.http.host=$(NODE_IP):9411
      -Dinflux_url=http://$(NODE_IP):2200
      -Dtalon.stats.enabled=true
      -Dcom.twitter.finagle.netty3.numWorkers=20
      -Dcom.twitter.finagle.netty4.numWorkers=20
      -Dlogback.configurationFile=logback.xml
      -Dconfig.resource={{JOBNAME_HYPHENATED}}-$(CK_ENVIRONMENT).conf
  - name: endpoint_type
    value: "{{JOBNAME_HYPHENATED}}"

consulKeys:
  - environment/service/hashicorp-vault

resources:
  limits:
    memory: 2048Mi
  requests:
    cpu: 0m
    memory: 0Mi

# The settings for hvaultToken are used to set policy around what namespaces in Hashicorp Vault, the service has access to.
# Is this used by the `token-create` container to initialize the vault token?
hvaultToken:
  required: True
  paths:
    - secret/bulk/auto-insurance/*
    - secret/bulk/auto-insurance

# Enable autoSidecars to deploy the envoy-proxy container in POD.
autoSidecars:
  traffic-proxy:
    enabled: true
    beta: true

