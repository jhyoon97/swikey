import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const getS3Client = () =>
  new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

export const POST = async (request: NextRequest) => {
  try {
    const { fileName, fileType } = (await request.json()) as {
      fileName: string;
      fileType: string;
    };

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 },
      );
    }

    const allowedTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 },
      );
    }

    const folder = fileType.startsWith('audio/')
      ? 'typing-sounds'
      : 'switch-images';
    const key = `${folder}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const s3 = getS3Client();
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const fileUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error('Failed to generate upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 },
    );
  }
};
