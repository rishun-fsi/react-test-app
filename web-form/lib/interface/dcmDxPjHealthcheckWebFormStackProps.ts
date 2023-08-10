import { StackProps } from 'aws-cdk-lib';

export interface DcmDxPjHealthcheckWebFormStackProps extends StackProps {
  readonly password: string;
}
