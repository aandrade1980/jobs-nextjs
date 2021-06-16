import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.NEXT_PUBLIC_BUCKET_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID
  })
});

export const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME }
});
