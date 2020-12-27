import * as cdk from '@aws-cdk/core';
import { UserPool, VerificationEmailStyle, UserPoolClient, AccountRecovery } from '@aws-cdk/aws-cognito';

export class CatsAuthentication extends cdk.Construct {
    public readonly userPool: UserPool;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        this.userPool = new UserPool(this, "UserPool", {
            selfSignUpEnabled: false,
            accountRecovery: AccountRecovery.EMAIL_ONLY,
            userVerification: {
                emailStyle: VerificationEmailStyle.CODE
            },
            autoVerify: {
                email: true
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true
                }
            }
        });

        const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
            userPool: this.userPool
        });

        new cdk.CfnOutput(this, "UserPoolId", { value: this.userPool.userPoolId });
        new cdk.CfnOutput(this, "UserPoolClientId", { value: userPoolClient.userPoolClientId });
    }
}