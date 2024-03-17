import aws from "aws-sdk";
const { S3 } = aws;

// Initialize S3 client
const s3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export let loader = async () => {
  const bucketName = "birthdate-beasts-s3";

  try {
    const s3Response: any = await s3
      .listObjectsV2({
        Bucket: bucketName,
      })
      .promise();

    // Optionally, generate presigned URLs for each object for direct access
    const files = await Promise.all(
      s3Response.Contents.map(async (file: any) => {
        const url = await s3.getSignedUrlPromise("getObject", {
          Bucket: bucketName,
          Key: file.Key,
          Expires: 60, // seconds
        });
        return { name: file.Key, url: url };
      })
    );

    return new Response(JSON.stringify(files), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error retrieving files from S3", { status: 500 });
  }
};
