import { Stack, Construct, StackProps, CfnOutput } from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate, ICertificate } from '@aws-cdk/aws-certificatemanager';

export class CertStack extends Stack {
    public readonly certificate: ICertificate;

    constructor(scope: Construct, id: string, props: StackProps | undefined) {
        super(scope, id, props);

        const zoneName = "aws.jogus.io";
        const domainName = "cats.aws.jogus.io";
        const subjectAlternativeNames = [
            "catsapi.aws.jogus.io"
        ];

        const hostedZone = HostedZone.fromLookup(this, 'Zone', { domainName: zoneName });

        // TLS certificate
        this.certificate = new DnsValidatedCertificate(this, 'SiteCertificate', {
            domainName,
            hostedZone,
            subjectAlternativeNames,
            region: 'us-east-1', // Cloudfront only checks this region for certificates.
        });

        new CfnOutput(this, 'Certificate', { value: this.certificate.certificateArn });
    }
}