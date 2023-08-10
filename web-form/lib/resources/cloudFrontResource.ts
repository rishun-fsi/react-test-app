import { Stack, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class CloudFrontResource extends Stack {
  public createOriginAccessIdentity(
    scope: Construct
  ): cloudfront.OriginAccessIdentity {
    const stage = this.node.tryGetContext('stage');

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      scope,
      `dcm-dx-pj-healthcheck-web-form-originAccessIdentity-${stage}`,
      {
        comment: `dcm-dx-pj-healthcheck-web-form-originAccessIdentity-${stage}`
      }
    );

    return originAccessIdentity;
  }

  public createResources(
    scope: Construct,
    originAccessIdentity: cloudfront.OriginAccessIdentity,
    websiteBucket: s3.Bucket
  ): cloudfront.Distribution {
    const stage = this.node.tryGetContext('stage');

    const distribution = new cloudfront.Distribution(
      scope,
      `dcm-dx-pj-healthcheck-web-form-cloudfront-${stage}`,
      {
        comment: `dcm-dx-pj-healthcheck-web-form-cloudfront-${stage}`,
        defaultRootObject: 'index.html',
        errorResponses: [
          {
            ttl: Duration.seconds(300),
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: '/index.html'
          },
          {
            ttl: Duration.seconds(300),
            httpStatus: 404,
            responseHttpStatus: 404,
            responsePagePath: '/error.html'
          }
        ],
        defaultBehavior: {
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          origin: new cloudfrontOrigins.S3Origin(websiteBucket, {
            originAccessIdentity
          })
        },
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        webAclId:
          'arn:aws:wafv2:us-east-1:095439996287:global/webacl/dcm-dx-pj-healthcheck-web-form-web-acl/7ac9377a-999d-4c63-a6ab-41ba714e437f'
      }
    );

    return distribution;
  }
}
