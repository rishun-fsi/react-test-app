import { Stack, RemovalPolicy, Duration } from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { getRDSSecurityGroupId, getSubnetIds, getVPCId } from '../util/stageSwitcher';
import { Stage } from '../interface/Stage';

export class RdsResource extends Stack {
  private stage: Stage;
  private securityGroup: ec2.ISecurityGroup;
  private instanceType: ec2.InstanceType;

  constructor(scope: Construct) {
    super();
    this.stage = this.node.tryGetContext('stage');
    this.securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      scope,
      'dcm-dx-pj-health-check-web-form-db-sg',
      getRDSSecurityGroupId(this.stage)
    );
    this.instanceType = new ec2.InstanceType('t3.small');
  }

  private createSubnetGroup(scope: Construct, vpc: ec2.IVpc): rds.SubnetGroup {
    const subnets = [
      ec2.Subnet.fromSubnetId(
        scope,
        'private-subnet-1',
        getSubnetIds(this.stage)[1]
      ),
      ec2.Subnet.fromSubnetId(
        scope,
        'private-subnet-2',
        getSubnetIds(this.stage)[2]
      )
    ];
    const subnetGroup = new rds.SubnetGroup(
      scope,
      `dcm-dx-pj-health-check-web-form-db-subnet-group-${this.stage}`,
      {
        description: 'Subnet Group for RDS',
        removalPolicy: RemovalPolicy.DESTROY,
        subnetGroupName: `rds-sng-${this.stage}`,
        vpcSubnets: {
          subnets
        },
        vpc
      }
    );

    return subnetGroup;
  }

  public createResource(scope: Construct): rds.DatabaseInstance {
    const vpc = ec2.Vpc.fromVpcAttributes(
      scope,
      'dcm-dx-pj-health-check-web-form-vpc',
      {
        vpcId: getVPCId(this.stage),
        availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c'],
        publicSubnetIds: [
          getSubnetIds(this.stage)[1],
          getSubnetIds(this.stage)[2]
        ]
      }
    );
    const subnetGroup: rds.SubnetGroup = this.createSubnetGroup(scope, vpc);

    const instance = new rds.DatabaseInstance(
      scope,
      `dcm-dx-pj-health-check-web-form-db-instance-${this.stage}`,
      {
        engine: rds.DatabaseInstanceEngine.POSTGRES,
        credentials: rds.Credentials.fromGeneratedSecret('postgres'),
        instanceType: this.instanceType,
        autoMinorVersionUpgrade: false,
        availabilityZone: 'ap-northeast-1a',
        instanceIdentifier: `dcm-dx-pj-health-check-web-form-db-instance-${this.stage}`,
        subnetGroup: subnetGroup,
        securityGroups: [this.securityGroup],
        backupRetention: Duration.days(7),
        databaseName: 'postgres',
        port: 5432,
        storageEncrypted: true,
        allocatedStorage: 200,
        removalPolicy: RemovalPolicy.DESTROY,
        vpc
      }
    );

    return instance;
  }

  public createProxy(
    scope: Construct,
    dbInstance: rds.DatabaseInstance
  ): rds.DatabaseProxy {
    if (!dbInstance.secret) {
      throw new Error('Secret is not found');
    }

    const proxy = new rds.DatabaseProxy(
      scope,
      `dcm-dx-pj-health-check-web-form-db-proxy-${this.stage}`,
      {
        proxyTarget: rds.ProxyTarget.fromInstance(dbInstance),
        secrets: [dbInstance.secret],
        vpc: dbInstance.vpc,
        dbProxyName: `dcm-dx-pj-health-check-web-form-db-proxy-${this.stage}`,
        securityGroups: [this.securityGroup]
      }
    );
    const role = new iam.Role(scope, 'DBProxyRole', {
      assumedBy: new iam.AccountPrincipal(Stack.of(this).account)
    });
    proxy.grantConnect(role, 'postgres');

    proxy.applyRemovalPolicy(RemovalPolicy.DESTROY);

    return proxy;
  }

  public createReadReplica(
    scope: Construct,
    dbInstance: rds.DatabaseInstance
  ): rds.DatabaseInstanceReadReplica {
    const readReplica = new rds.DatabaseInstanceReadReplica(
      scope,
      `dcm-dx-pj-health-check-web-form-db-readreplica-${this.stage}`,
      {
        instanceType: this.instanceType,
        sourceDatabaseInstance: dbInstance,
        vpc: dbInstance.vpc,
        securityGroups: [
          ec2.SecurityGroup.fromSecurityGroupId(
            scope,
            'dcm-dx-pj-health-check-web-form-db-readreplica-sg',
            'sg-0fb4cdd5466794e2f'
          )
        ],
        subnetGroup: rds.SubnetGroup.fromSubnetGroupName(
          scope,
          'dcm-dx-pj-health-check-web-form-db-readreplica-sng',
          'dcm-dx-pj-health-check-web-form-public-sng'
        ),
        publiclyAccessible: true,
        instanceIdentifier: `dcm-dx-pj-health-check-web-form-db-readreplica-${this.stage}`
      }
    );

    readReplica.applyRemovalPolicy(RemovalPolicy.DESTROY);

    return readReplica;
  }
}
