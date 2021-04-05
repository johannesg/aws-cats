import { Stack, Construct, StackProps, CfnOutput } from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate, ICertificate } from '@aws-cdk/aws-certificatemanager';

export class CertStack extends Stack {
    public readonly certificateEdgeOld: ICertificate;
    public readonly certificateEdge: ICertificate;
    public readonly certificateRegional: ICertificate;

    constructor(scope: Construct, id: string, props: StackProps | undefined) {
        super(scope, id, props);

        const zoneName = "aws.jogus.io";
        const domainName = "cats.aws.jogus.io";
        const subjectAlternativeNames = [
            "catsapi.aws.jogus.io"
        ];

        const hostedZone = HostedZone.fromLookup(this, 'Zone', { domainName: zoneName });

        // TLS certificate
        this.certificateEdgeOld = new DnsValidatedCertificate(this, 'SiteCertificate', {
            domainName,
            hostedZone,
            subjectAlternativeNames,
            region: 'us-east-1', // Cloudfront only checks this region for certificates.
        });

        // TLS certificate
        this.certificateEdge = new DnsValidatedCertificate(this, 'SiteCertificate2', {
            domainName: "*.aws.jogus.io",
            hostedZone,
            region: 'us-east-1', // Cloudfront only checks this region for certificates.
        });

        this.certificateRegional = new DnsValidatedCertificate(this, 'SiteCertificateRegional', {
            domainName: "*.aws.jogus.io",
            hostedZone
        });

        new CfnOutput(this, 'CertificateEdgeOld', { value: this.certificateEdgeOld.certificateArn });
        new CfnOutput(this, 'CertificateEdge', { value: this.certificateEdge.certificateArn });
        new CfnOutput(this, 'CertificateRegional', { value: this.certificateRegional.certificateArn });
    }
}