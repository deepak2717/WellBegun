import { GraphQLContext } from '@ck/graphql-framework/core'
import createInsuranceServiceConnector from '../../../connectors/autoInsuranceServiceConnector'
import { logUBIInfo, logUBIError, logUBIWarning } from '../utils'

export interface IUBI{{CLASSNAME_CAPITAL}}Response {
  success: boolean
}

export async function {{CLASSNAME_CAMEL}}Resolver(
  context: GraphQLContext,
  insuranceServiceConnector = createInsuranceServiceConnector,
): Promise<IUBI{{CLASSNAME_CAPITAL}}Response> {
  const TAG = '{{CLASSNAME_CAMEL}}Mutation'
  try {
    const response: IUBI{{CLASSNAME_CAPITAL}}Response = await insuranceServiceConnector().{{CLASSNAME_CAMEL}}InUBI(
      context,
    )

    if (response.success) {
      logUBIInfo(context, [TAG], '{{CLASSNAME_SPACED}} was successful')
    } else {
      logUBIWarning(context, [TAG, 'success = false'], '{{CLASSNAME_SPACED}} failed')
    }

    return response
  } catch (error) {
    const message = error.message || 'Error occurred during {{CLASSNAME_SPACED}}'
    logUBIError(context, [TAG], message)
    // Return false when an error occurs during {{CLASSNAME_SPACED}} process
    return { success: false }
  }
}
