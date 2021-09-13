import * as cdk from '@aws-cdk/core';
import { UserPool, VerificationEmailStyle, UserPoolClient, AccountRecovery } from '@aws-cdk/aws-cognito';

export class CatsCognito extends cdk.Construct {
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const userPool = new UserPool(this, "UserPool", {
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

        const domain = userPool.addDomain("CatsDomain", {
            cognitoDomain: {
                domainPrefix: "jogus-cats"
            }
        });

        const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
            userPool: userPool,
            authFlows: {
                userPassword: true,
                // adminUserPassword: true,
                userSrp: true
            }
        });

        new cdk.CfnOutput(this, "UserPoolBaseUrl", { value: domain.baseUrl()})

        new cdk.CfnOutput(this, "UserPoolArn", { value: userPool.userPoolId, exportName: "cats-user-pool-arn" });
        new cdk.CfnOutput(this, "UserPoolId", { value: userPool.userPoolId, exportName: "cats-user-pool-id" });
        new cdk.CfnOutput(this, "UserPoolClientId", { value: userPoolClient.userPoolClientId, exportName: "cats-user-pool-clientid" });
    }
}