# World Modelers S3
Accessing the World Modelers S3 requires an AWS access key and secret key.

Using the Boto3 Python library, you can connect to S3 using the following:

```
import boto3

session = boto3.Session(
    aws_access_key_id='YOUR_ACCESS_KEY',
    aws_secret_access_key='YOUR_SECRET_KEY',
)

s3 = session.resource('s3')
```

You should then select the `world-modelers` bucket with:

```
bucket = s3.Bucket('world-modelers')
```

You can print out all the available keys using:

```
for obj in bucket.objects.all():
    print(obj.key)
```

or you can download a specific key with:

```
bucket.download_file('source_key', 'target_file_name')
```
    