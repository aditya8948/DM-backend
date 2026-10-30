const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const crypto = require('crypto');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

class S3Service {
  async uploadFile(file) {
    const bucket = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION || 'ap-south-1';
    const ext = path.extname(file.originalname);
    const key = `uploads/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await s3Client.send(command);

    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return {
      fileUrl,
      fileName: file.originalname,
      fileType: file.mimetype
    };
  }
}

module.exports = new S3Service();

