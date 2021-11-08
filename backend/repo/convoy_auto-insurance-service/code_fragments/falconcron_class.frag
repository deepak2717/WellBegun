package com.creditkarma.autos.ubi.reporting

import java.time.LocalDate

import com.creditkarma.autos.clients.DwNumericIdMappingClient
import com.creditkarma.autos.clients.bigquery.{BigQueryClient, BigQueryClientConfig}
import com.creditkarma.autos.ubi.onboarding.{EnrollmentRepository, EnrollmentStatus}
import com.creditkarma.autos.util.DateTimeUtils
import com.creditkarma.talon.config.TalonConfig
import com.creditkarma.talon.hashicorp.vault.SecretValue
import com.creditkarma.talon.sharding.ShardingBuilder
import com.creditkarma.talon.stats.TalonStatsReceiver
import com.creditkarma.talonz._
import com.creditkarma.thrift.core.domain.DwNumericId
import com.twitter.concurrent.AsyncStream
import com.twitter.util.{Await, Future}
import com.typesafe.scalalogging.LazyLogging

import scala.util.Try

object {{JOBNAME_CAPITAL}}Job extends LazyLogging {

  final case class ReportedQuoteDate(
    dwNumericId: DwNumericId,
    quoteStartDate: Option[LocalDate],
    quoteCompleteDate: Option[LocalDate]
  )

  final case class JobReport(
    rows: Int,
    rowsSuccess: Int,
    rowsFailure: Int
  )

//<==============================BEGINNING_OF_CODEBLOCK_TO_BE_EDITED_BEFORE_COMMIT===========
  private val query: String =
    """
      |SELECT
      |  numericId AS dwNumericId,
      |  eventdate AS quoteStartDate,
      |  postingdate AS quoteCompleteDate
      |FROM `modular-shard-92519.dw.fact_tracking_revenue_ext`
      |WHERE partner = 'Progressive'
      |ORDER BY quoteStartDate, quoteCompleteDate
      |""".stripMargin.replaceAll("\n", " ")

  private def queryReportedQuoteDates(bqClient: BigQueryClient): Stream[ReportedQuoteDate] = {
    bqClient
      .executeQuery(query) { row =>
        val dwNumericId: Option[DwNumericId] =
          Try(row.get("dwNumericId").getLongValue).toOption.map(DwNumericId.apply)

        val quoteStartDate: Option[LocalDate] =
          Try(row.get("quoteStartDate").getStringValue).toOption.flatMap(DateTimeUtils.isoDateToLocalDate)

        val quoteCompleteDate: Option[LocalDate] =
          Try(row.get("quoteCompleteDate").getStringValue).toOption.flatMap(DateTimeUtils.isoDateToLocalDate)

        dwNumericId.map(ReportedQuoteDate(_, quoteStartDate, quoteCompleteDate))
      }
      .flatten
  }
//<==============================END_OF_CODEBLOCK_TO_BE_EDITED_BEFORE_COMMIT===========

  def run(): Unit = {
    logger.info(s"UBI Info: {{JOBNAME_HYPHENATED}} start")
    val stats = TalonStatsReceiver().scope("auto-insurance-{{JOBNAME_HYPHENATED}}")

    val jobReportF: Future[JobReport] = (for {
      sharding <- ShardingBuilder("numericId").build
      talonConfig <- TalonConfig.futureDefaultConfig
      bigQueryConf = talonConfig.get[BigQueryClientConfig]("bigquery").getOrThrow
      credentials: SecretValue <- bigQueryConf.credential.value
    } yield {
      val bqClient = new BigQueryClient(credentials.secret)
      val enrollmentRepo = new EnrollmentRepository(sharding)

      // TODO: can optimize for concurrent processing once it works
      AsyncStream
        .fromSeq(queryReportedQuoteDates(bqClient))

        // -- get numericId from dwNumericId --
        .mapF {
          case reported @ ReportedQuoteDate(dwNumericId, _, _) =>
            DwNumericIdMappingClient
              .getNumericId(dwNumericId)
              .map(Option(_, reported))
              .onFailure(error =>
                logger.error(
                  s"UBI Error: {{JOBNAME_HYPHENATED}}: Failure to get numericId with dwNumericId: ${error.getClass.getName}"
                )
              )
              .rescue { case _ => Future.None }
        } // returns: Option[(NumericId, ReportedQuoteDate)]

//<==============================BEGINNING_OF_CODEBLOCK_TO_BE_EDITED_BEFORE_COMMIT===========
        // -- find most recent enrollment for numericId --
        .mapF {
          case Some((numericId, reported)) =>
            enrollmentRepo
              .find(numericId)
              .map {
                case Some(enrollment) => Option((numericId, enrollment, reported))
                case None =>
                  logger.error("UBI Error: {{JOBNAME_HYPHENATED}}: No enrollment found for numericId")
                  None
              }
              .onFailure(error =>
                logger.error(s"UBI Error: {{JOBNAME_HYPHENATED}}: Failure to find enrollment for numericId: $error")
              )
              .rescue { case _ => Future.None }
          case None => Future.None
        } // returns: Option[(NumericId, Enrollment, ReportedQuoteDate)]

        // -- update enrollment --
        // only enrollment with current status equal to `PendingUserApplication` or `QuoteFulfilled` could be updated
        .mapF {
          case Some((numericId, enrollment, ReportedQuoteDate(_, quoteStartDate, quoteCompleteDate))) =>
            enrollmentRepo
              .updateQuoteFulfilled(numericId, enrollment, quoteStartDate, quoteCompleteDate)
              .map(Option.apply)
              .onFailure(error =>
                logger.error(
                  s"UBI Error: {{JOBNAME_HYPHENATED}}: Failure to update enrollment quote dates: ${error.getClass.getName}"
                )
              )
              .rescue { case _ => Future.None }
          case None => Future.None
        } // returns: Option[OK]

//<==============================END_OF_CODEBLOCK_TO_BE_EDITED_BEFORE_COMMIT===========
        // -- map to JobReport --
        .map {
          case Some(_) => JobReport(rows = 1, rowsSuccess = 1, rowsFailure = 0)
          case None => JobReport(rows = 1, rowsSuccess = 0, rowsFailure = 1)
        } // returns: JobReport

        // -- accumulate JobReport --
        .foldLeft(JobReport(rows = 0, rowsSuccess = 0, rowsFailure = 0)) {
          case (b, a) =>
            // counters
            stats.counter("rows").incr(a.rows)
            stats.counter("rowsSuccess").incr(a.rowsSuccess)
            stats.counter("rowsFailure").incr(a.rowsFailure)

            JobReport(
              rows = b.rows + a.rows,
              rowsSuccess = b.rowsSuccess + a.rowsSuccess,
              rowsFailure = b.rowsFailure + a.rowsFailure
            )
        }
    }).flatten

    val jobReport = Await.result(jobReportF)

    // gauge
    val jobReportStats = stats.scope("jobReport")
    jobReportStats.addGauge("rows")(jobReport.rows)
    jobReportStats.addGauge("rowsSuccess")(jobReport.rowsSuccess)
    jobReportStats.addGauge("rowsFailure")(jobReport.rowsFailure)

    logger.info(s"UBI Info: {{JOBNAME_CAPITAL}}Job completed: $jobReport")
  }
}

