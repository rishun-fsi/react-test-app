import { Stack, Duration, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as path from 'path';

export class LambdaResource extends Stack {
  private password: string;
  private dbEndpoint: string;
  private vpc: ec2.IVpc;
  private subnets: ec2.ISubnet[];
  private securityGroup: ec2.ISecurityGroup;
  private executionRole: iam.Role;

  constructor(scope: Construct, password: string, dbEndpoint: string) {
    super();
    this.password = password;
    this.dbEndpoint = dbEndpoint;

    this.vpc = ec2.Vpc.fromVpcAttributes(
      scope,
      'dcm-dx-pj-healthcheck-web-form-lambda-vpc',
      {
        vpcId: 'vpc-098a9089d6918c284',
        availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c']
      }
    );

    this.subnets = [
      ec2.Subnet.fromSubnetAttributes(
        scope,
        'dcm-dx-pj-healthcheck-web-form-lambda-vpc-subnet',
        {
          subnetId: 'subnet-00590d3de7aa1bed5',
          availabilityZone: 'ap-northeast-1a',
          routeTableId: 'rtb-0b2abffa99d4a6ba8'
        }
      )
    ];

    this.securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      scope,
      'dcm-dx-pj-healthcheck-web-form-lambda-sg',
      'sg-05e6f4e49bb0386fb'
    );

    this.executionRole = this.createExecutionRole(scope);
  }

  private createExecutionRole(scope: Construct): iam.Role {
    const stage: string = this.node.tryGetContext('stage');

    const lambdaRole = new iam.Role(
      scope,
      `dcm-dx-pj-healthcheck-web-form-function-execution-role-${stage}`,
      {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        description: 'Execution role for Docomo DX pj-healthcheck-web-form',
        inlinePolicies: {
          lambdaExecutionPolicy: new iam.PolicyDocument({
            statements: [
              new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                  'logs:CreateLogGroup',
                  'logs:CreateLogStream',
                  'logs:PutLogEvents',
                  'ec2:CreateNetworkInterface',
                  'ec2:DescribeNetworkInterfaces',
                  'ec2:DeleteNetworkInterface',
                  'ec2:AssignPrivateIpAddresses',
                  'ec2:UnassignPrivateIpAddresses',
                  'secretsmanager:DescribeSecret',
                  'secretsmanager:GetSecretValue',
                  'secretsmanager:PutSecretValue',
                  'secretsmanager:UpdateSecretVersionStage'
                ],
                resources: ['*']
              })
            ]
          })
        }
      }
    );

    return lambdaRole;
  }

  public createResources(scope: Construct, codeDir: string): lambda.Function {
    const stage = this.node.tryGetContext('stage');

    const lambdaFunction = new lambda.Function(
      scope,
      `dcm-dx-pj-healthcheck-web-form-${codeDir}-function-${stage}`,
      {
        code: lambda.Code.fromAsset(
          path.join(__dirname, `../../lambda/${codeDir}`)
        ),
        handler: 'index.lambdaHandler',
        runtime: lambda.Runtime.NODEJS_14_X,
        role: this.executionRole,
        allowPublicSubnet: true,
        vpc: this.vpc,
        vpcSubnets: {
          subnets: this.subnets
        },
        securityGroups: [this.securityGroup],
        timeout: Duration.minutes(10),
        memorySize: 512,
        environment: {
          STAGE: stage,
          PASSWORD: this.password,
          DB_ENDPOINT: this.dbEndpoint
        }
      }
    );
    return lambdaFunction;
  }
}
