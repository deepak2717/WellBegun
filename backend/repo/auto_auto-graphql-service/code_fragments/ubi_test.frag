import { expect } from 'chai'
import 'mocha'
import { {{CLASSNAME_CAMEL}}Resolver } from '../../../../main/feature/usageBasedInsurance/{{CLASSNAME_CAMEL}}'
import {
  I{{CLASSNAME_CAPITAL}}Response,
  {{CLASSNAME_CAPITAL}}Response,
} from '../../../../generated/com/creditkarma/thrift/auto/insurance/ubi/v1/ubi'
import { getMockContext } from '@ck/graphql-framework-testing'
import { AutoInsuranceServiceConnector } from '../../../../main/connectors/autoInsuranceServiceConnector'

const mockContext = getMockContext()

describe('Usage Based Insurance resolvers', () => {
  it('should {{CLASSNAME_SPACED}} in UBI', async () => {
    const mockConnector = () =>
      (({
        {{CLASSNAME_CAMEL}}InUBI: (): Promise<I{{CLASSNAME_CAPITAL}}Response> => {
          return Promise.resolve(new {{CLASSNAME_CAPITAL}}Response({ success: true }))
        },
      } as unknown) as AutoInsuranceServiceConnector)
    const sut = await {{CLASSNAME_CAMEL}}Resolver(mockContext, mockConnector)
    expect(sut.success).equals(true)
  })
  it('should return a valid response in case of service error (unhappy path)', async () => {
    const mockConnector = () =>
      (({
        {{CLASSNAME_CAMEL}}InUBI: (): Promise<I{{CLASSNAME_CAPITAL}}Response> => {
          return Promise.resolve(new {{CLASSNAME_CAPITAL}}Response({ success: false }))
        },
      } as unknown) as AutoInsuranceServiceConnector)
    const sut = await {{CLASSNAME_CAMEL}}Resolver(mockContext, mockConnector)
    expect(sut.success).equals(false)
  })
})
