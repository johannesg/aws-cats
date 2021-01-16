import { CfnOutput, CfnParameter, Construct } from "@aws-cdk/core"
import * as s3 from '@aws-cdk/aws-s3';

export class S3ObjectParameter {
    private readonly bucketNameParam: CfnParameter;
    private readonly objectKeyParam: CfnParameter;
    // private readonly objectVersionParam: CfnParameter;

    constructor(scope: Construct, id: string) {
        this.bucketNameParam = new CfnParameter(scope, `${id}_BucketName`, { type: 'String'});
        this.objectKeyParam = new CfnParameter(scope, `${id}_ObjectKey`, { type: 'String'});
    }

    public assign(location: s3.Location): { [name: string]: any } {
        const ret: { [name: string]: any } = {};
        ret[this.bucketNameParam.logicalId] = location.bucketName;
        ret[this.objectKeyParam.logicalId] = location.objectKey;
        return ret;
      }

    public get location() : s3.Location {
        return {
            bucketName: this.bucketNameParam.valueAsString,
            objectKey: this.objectKeyParam.valueAsString
        };
    }
}
