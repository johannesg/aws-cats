#!/usr/bin/env node
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as route53 from '@aws-cdk/aws-route53';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import * as cdk from '@aws-cdk/core';
import * as targets from '@aws-cdk/aws-route53-targets/lib';
import { Construct } from '@aws-cdk/core';
import { AllowedMethods } from '@aws-cdk/aws-cloudfront';

export interface CatsAppProps {
    domainName: string
    zone: route53.IHostedZone
    certificate: ICertificate
    source: s3.Location
}

export class CatsApp extends Construct {
    constructor(parent: Construct, name: string, { zone, domainName, source, certificate }: CatsAppProps) {
        super(parent, name);

        new cdk.CfnOutput(this, 'Site', { value: 'https://' + domainName });

        // Content bucket
        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
            // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
            // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
            // removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
        });

        new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });

        // CloudFront distribution that provides HTTPS
        const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
            certificate,
            domainNames: [domainName],
            defaultRootObject: "index.html",
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2018,
            defaultBehavior: { 
                origin: new origins.S3Origin(siteBucket),
                allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            }
        });

        new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

        // Route53 alias record for the CloudFront distribution
        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: domainName,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
            zone
        });

        const sourceBucket = s3.Bucket.fromBucketName(this, 'AppCodeBucket', source.bucketName);
        
        // Deploy site contents to S3 bucket
        new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
            sources: [s3deploy.Source.bucket(sourceBucket, source.objectKey)],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }
}