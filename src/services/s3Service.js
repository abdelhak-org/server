import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {getConfig} from "../config.js";
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadImage = async (file) => {
  try {
    const params = {
      Bucket: getConfig().AWS_BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return {
      message: "File uploaded successfully",
      fileUrl: `https://${params.Bucket}.s3.${getConfig().AWS_REGION}.amazonaws.com/${params.Key}`,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

export const deleteImage = async (key) => {
  try {
    const params = {
      Bucket: getConfig().AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return { message: "File deleted successfully" };
  } catch (error) {
    throw new Error("Failed to delete file");
  }
};
