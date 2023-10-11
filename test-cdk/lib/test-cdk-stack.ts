import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class TestCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "test-vpc-dev", {
      cidr: "10.0.0.0/16",
      defaultInstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      subnetConfiguration: [],
    });

    const pubSubnet1 = new ec2.Subnet(this, "test-public1-subnet-1a", {
      availabilityZone: "ap-northeast-1a",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.0.0/24",
    });
    const pubSubnet2 = new ec2.Subnet(this, "test-public2-subnet-1c", {
      availabilityZone: "ap-northeast-1c",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.1.0/24",
    });

    new ec2.Subnet(this, "test-private1-subnet-1a", {
      availabilityZone: "ap-northeast-1a",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.2.0/24",
    });

    new ec2.Subnet(this, "test-private2-subnet-1c", {
      availabilityZone: "ap-northeast-1c",
      vpcId: vpc.vpcId,
      cidrBlock: "10.0.3.0/24",
    });

    const internetGateway = new ec2.CfnInternetGateway(
      this,
      "test-igw",
      {}
    );
    new ec2.CfnVPCGatewayAttachment(this, "igw-test-vpc", {
      vpcId: vpc.vpcId,
      internetGatewayId: internetGateway.ref,
    });

    pubSubnet1.addRoute("test-rtb-public1-ap-northeast-1a", {
      routerType: ec2.RouterType.GATEWAY,
      routerId: internetGateway.ref,
    });

    pubSubnet2.addRoute("test-rtb-public2-ap-northeast-1c", {
      routerType: ec2.RouterType.GATEWAY,
      routerId: internetGateway.ref,
    });

  }
}