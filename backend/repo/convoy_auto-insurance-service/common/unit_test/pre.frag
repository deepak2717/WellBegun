package com.creditkarma.autos.ubi.{{$PACKAGE_NAME$}}

import com.creditkarma.autos.clients._
import com.creditkarma.thrift.core.domain.NumericId
import com.twitter.finagle.Service
import com.twitter.finagle.stats.NullStatsReceiver
import com.twitter.util.{Await, Future}
import org.scalatest.{FlatSpec, Matchers}
import org.scalatest.{FlatSpec, Matchers}
import com.creditkarma.thrift.auto.insurance.v1.ubi._

class UBI{{$CLASS_NAME$}}Spec extends FlatSpec with Matchers {

