bigquery {
  credential = {
    key = "bigquery/service-account-json"
  }
}

hashicorp-vault {
  enabled = true
  destination = "hashicorp-vault.corp.creditkarma.com:6661"
  protocol = "https"
  ssl-validation = false
  namespace = "/secret/bulk/auto-insurance"
}

talon.security.auth-service {
  url = "https://vault.creditkarma.com:8110"
  client-id {
    default = "auto-insurance-bulk"
    key = "auth/client"
  }
  secret {
    default = "XIgASK2XBNGpzvLn_DcKVeehOUBjAtSkABy6g6xErHB0KrrltLkFZd3DrzoYcAQsiVuV93RSPnCW9emPHM9nxA"
    key = "auth/secret"
  }
}

clients {
  numeric-id-mapping-service-bulk {
    enabled = true
    use-http = true
    destination = ${NODE_IP}":4140"
    http.http-header = "numeric-id-mapping-service"
    http.host-header = "numeric-id-mapping-service-bulk.service"
    transport-settings {
      request-timeout = 2s
    }
  }
}

talon {
  stats {
    enabled = true
    stats-prefix = [ "talon", "{{JOBNAME_HYPHENATED}}"]
    influxdb-emitter {
      enabled = true
      hostname = "localhost"
      port = 2200
      protocol = "udp"
    }
  }
}

database {
  user {
    default = "root"
    key = "database/userlocal"
  }
  password {
    default = "root"
    key = "database/passwordlocal"
  }
  connection-settings {
    session-pool {
      min-size = 0
      max-size = 4
      idle-time = 30s
      max-waiters = 50
    }
  }
  sharding {
    numericId {
      prefix = "autoInsurance_numericId_"
      shard-info {
        default {
          shard-count = 4
          shard-map = [{
            "virtual-start" = 0,
            "virtual-end" = 3,
            "destination" = "localhost:3306"
          }]
        }
      }
    }
  }
}

