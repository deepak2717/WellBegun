include "{{JOBNAME_HYPHENATED}}.conf"

hashicorp-vault {
  enabled = true
  ssl-validation = true
}

database {
  sharding.numericId.shard-info.key = "environment/database/shard-map"
  user {
    default = "root"
    key = "database/user"
  }
  password {
    default = "root"
    key = "database/password"
  }
}

talon.security {
  auth-service {
    url = "http://auth-service"
    destination = ${NODE_IP}":9110"
  }
}

