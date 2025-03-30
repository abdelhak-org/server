
import s3Client from '../../aws.config.js'; // Import the S3 client
import { PutObjectCommand  , DeleteObjectCommand} from "@aws-sdk/client-s3";

export const s3Controller = {

  uploadImage: async (req, res) => {
    try {
      const file =   req.file;
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);
      res.status(200).json({
        message: 'File uploaded successfully',
        fileUrl: `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`,
      });
    } catch (error) {
      console.error("Error in uploading file:", error);
      res.status(500).json({ message: 'Error in uploading file', error: error.message });
    }
  },

  deleteImage: async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ message: 'No URL provided' });
      }
      const parsedUrl = new URL(url);
      const key = parsedUrl.pathname.substring(1);
      const params = {
        Bucket: process.en.AWS_BUCKET_NAME,
        Key: key,
      };
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: 'Error in deleting file', error: error.message });
    }
  }

};


//export default s3Controller