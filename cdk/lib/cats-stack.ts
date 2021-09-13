import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import { CatsApi } from './cats-api';
import { CatsApp } from './cats-app';
import { S3ObjectParameter } from './utils';
import { Table } from '@aws-cdk/aws-dynamodb';
import { Fn } from '@aws-cdk/core';

export interface CatsStackProps extends cdk.StackProps {
  envName: string
}

export class CatsStack extends cdk.Stack {
  public readonly lambdaCode: S3ObjectParameter;
  public readonly appCode: S3ObjectParameter;
  public readonly appDomain: string;
  public readonly apiDomain: string;
  public readonly envName: string;

  constructor(scope: cdk.Construct, id: string, props: CatsStackProps) {
    super(scope, id, props);

    this.lambdaCode = new S3ObjectParameter(this, "LambdaCode");
    this.appCode = new S3ObjectParameter(this, "AppCode");
    this.envName = props.envName;

    const certificateEdge =
      Certificate.fromCertificateArn(this, "CertificateEdge", Fn.importValue("aws-jogus-certificate-edge"));
    const certificateRegional =
      Certificate.fromCertificateArn(this, "CertificateRegional", Fn.importValue("aws-jogus-certificate-regional"));

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: "aws.jogus.io" });

    const table = Table.fromTableArn(this, "CatsTable", Fn.importValue("cats-dynamodb-tablearn"));

    const domainSuffix = props.envName.toLowerCase() === "prod"
      ? ""
      : `-${props.envName.toLowerCase()}`;

    this.apiDomain = `cats-api${domainSuffix}.aws.jogus.io`;
    this.appDomain = `cats${domainSuffix}.aws.jogus.io`;

    console.log(`Env: ${props.envName}; api domain: ${this.apiDomain}`);
    console.log(`Env: ${props.envName}; app domain: ${this.appDomain}`);

    const api = new CatsApi(this, "ApiApollo", {
      domainName: this.apiDomain,
      zone,
      certificate: certificateRegional,
      source: this.lambdaCode.location,
      table,
      envName: props.envName
    });

    const site = new CatsApp(this, "AppSite", {
      domainName: this.appDomain,
      zone,
      certificate: certificateEdge,
      source: this.appCode.location
    });
  }
}
