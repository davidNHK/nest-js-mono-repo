import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export function createAPIGateWay(lambda: aws.lambda.Function) {
  const prefixConfig = new pulumi.Config('prefix');
  const namePrefix = prefixConfig.require('name');
  new aws.lambda.Permission(`${namePrefix}-lambda-api-gateway-permission`, {
    action: 'lambda:InvokeFunction',
    function: lambda,
    principal: 'apigateway.amazonaws.com',
  });

  // Set up the API Gateway
  const apigw = new aws.apigatewayv2.Api('httpApiGateway', {
    protocolType: 'HTTP',
    routeKey: '$default',
    target: lambda.invokeArn,
  });
  return { apigw };
}
