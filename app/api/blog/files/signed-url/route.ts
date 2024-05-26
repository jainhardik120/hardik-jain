import ErrorResponse from "@/lib/ErrorResponse";
import { authMiddleware } from "@/middleware/Auth";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
})

export async function POST(request: Request) {
  return authMiddleware(request, async (userId) => {
    const {filename, filetype} = await request.json();
    if (!filename || !filetype) {
      return ErrorResponse("Filename and Filetype are required");
    }
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${filename}`,
      ContentType: filetype
    })
    const signedUrl = await getSignedUrl(s3Client, command);
    return Response.json({ signedUrl });
  })
}