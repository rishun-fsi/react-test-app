import { Stage } from '../interface/Stage';

type SubnetIds = { 1: string; 2: string };
type ParameterPerStage = { dev: string; stage: string; prod: string };
type SubnetIdsPerStage = { dev: SubnetIds; stage: SubnetIds; prod: SubnetIds };

export const getVPCId = (stage: Stage): string => {
  const vpcIds: ParameterPerStage = {
    dev: 'vpc-098a9089d6918c284',
    stage: '',
    prod: 'vpc-02bf0d8e5fbf98094'
  };
  return vpcIds[stage];
};

export const getSubnetIds = (stage: Stage): SubnetIds => {
  const privateSubnetIds: SubnetIdsPerStage = {
    dev: { 1: 'subnet-00590d3de7aa1bed5', 2: 'subnet-0f7eea90fe5989f0f' },
    stage: { 1: '', 2: '' },
    prod: { 1: 'subnet-0e5d1a252c42c8262', 2: 'subnet-0c9103c570913d5db' }
  };
  return privateSubnetIds[stage];
};

export const getRouteTableId = (stage: Stage): string => {
  const routeTableIds: ParameterPerStage = {
    dev: 'vpc-098a9089d6918c284',
    stage: '',
    prod: 'vpc-02bf0d8e5fbf98094'
  };
  return routeTableIds[stage];
};

export const getRDSSecurityGroupId = (stage: Stage): string => {
  const securityGroupIds: ParameterPerStage = {
    dev: 'sg-0d037f25de70c99db',
    stage: '',
    prod: 'sg-0c03e50a7b6b58999'
  };

  return securityGroupIds[stage];
};

export const getWebAclArn = (stage: Stage): string => {
  const webAclArn: ParameterPerStage = {
    dev: 'arn:aws:wafv2:us-east-1:095439996287:global/webacl/dcm-dx-pj-healthcheck-web-form-web-acl/7ac9377a-999d-4c63-a6ab-41ba714e437f',
    stage: '',
    prod: 'arn:aws:wafv2:us-east-1:974187140044:global/webacl/dcm-dx-pj-healthcheck-web-form-web-acl/4022cd91-3bb0-4bbd-b397-6926a671ce7e'
  };

  return webAclArn[stage];
};

export const getSecretId = (stage: Stage): string => {
  const secretIds: ParameterPerStage = {
    dev: 'dcmdxpjhealthcheckwebformst-cD5kOFVF3Vo1',
    stage: '',
    prod: 'dcmdxpjhealthcheckwebformst-sTVGLzcQ81F8'
  };
  return secretIds[stage];
};

export const getAccountId = (stage: Stage): string => {
  const accountIds: ParameterPerStage = {
    dev: '095439996287',
    stage: '',
    prod: '974187140044'
  };
  return accountIds[stage];
};
