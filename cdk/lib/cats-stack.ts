import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { CatsAuthentication } from './cats-auth';
import { CatsApi } from './cats-api';
import { CatsApp } from './cats-app';
import { S3ObjectParameter } from './utils';
import { CatsTableStack } from './cats-table-stack';
import { Table } from '@aws-cdk/aws-dynamodb';

export interface CatsStackProps extends cdk.StackProps {
}

export class CatsStack extends cdk.Stack {
  public readonly lambdaCode: S3ObjectParameter;
  public readonly appCode: S3ObjectParameter;

  constructor(scope: cdk.Construct, id: string, props: CatsStackProps) {
    super(scope, id, props);

    this.lambdaCode = new S3ObjectParameter(this, "LambdaCode");
    this.appCode = new S3ObjectParameter(this, "AppCode");

    const certificateEdge =
      Certificate.fromCertificateArn(this, "CertificateEdge",
        "arn:aws:acm:us-east-1:700595718361:certificate/37ff910c-28e1-4e64-b77f-806eef9d1ff0");
    const certificateRegional =
      Certificate.fromCertificateArn(this, "CertificateRegional",
        "arn:aws:acm:eu-north-1:700595718361:certificate/3fac9580-bd98-429e-87c5-b46247cdf740");

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: "aws.jogus.io" });

    const table = Table.fromTableName(this, "CatsTable", "CatsTableStack-Cats69A4F22A-S59VSEAFBWLL");

    const auth = new CatsAuthentication(this, "Auth");

    const api = new CatsApi(this, "ApiApollo", {
      domainName: "catsapi.aws.jogus.io",
      auth,
      zone,
      certificate: certificateRegional,
      source: this.lambdaCode.location,
      table
    });


    const site = new CatsApp(this, "AppSite", {
      domainName: "cats.aws.jogus.io",
      zone,
      certificate: certificateEdge,
      source: this.appCode.location
    });
  }
}
