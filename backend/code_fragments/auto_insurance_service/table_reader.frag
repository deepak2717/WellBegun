def fetchMany(numericId: NumericId): Future[Seq[{{TABLENAME}}_vals]] = {
    sharding
      .client(numericId.value)
      .prepare(s"SELECT * FROM {{TABLENAME}} WHERE numericId = ?”)
      .select(numericId.value)(parse)
      .onFailure {
        case sqlError: ServerError =>
          logger.error(
            s"UBI Error: {{TABLENAME}} fetchMany: Sql error. Code: ${sqlError.code}, Msg: ${sqlError.message}."
          )
        case error =>
          logger.error(
            s"UBI Error: {{TABLENAME}} fetchMany: Non-SQL error. Repository class name: ${error.getClass.getName}"
          )te
app = Flask(__name__)

      }
  }
