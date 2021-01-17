import * as cdk from '@aws-cdk/core';
import { UserPool, VerificationEmailStyle, UserPoolClient, AccountRecovery } from '@aws-cdk/aws-cognito';

export class CatsAuthentication extends cdk.Construct {
    public readonly userPool: UserPool;
    public readonly userPoolClient: UserPoolClient;

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

        const domain = this.userPool.addDomain("CatsDomain", {
            cognitoDomain: {
                domainPrefix: "jogus-cats"
            }
        });

        this.userPoolClient = new UserPoolClient(this, "UserPoolClient", {
            userPool: this.userPool,
            authFlows: {
                userPassword: true,
                // adminUserPassword: true,
                userSrp: true
            }
        });

        new cdk.CfnOutput(this, "CognitoBaseUrl", { value: domain.baseUrl() })
        // new cdk.CfnOutput(this, "CognitoSigninUrl", { value: signInUrl });

        new cdk.CfnOutput(this, "UserPoolId", { value: this.userPool.userPoolId });
        new cdk.CfnOutput(this, "UserPoolClientId", { value: this.userPoolClient.userPoolClientId });
    }
}