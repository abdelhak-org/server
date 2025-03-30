import { Router  } from "express";
import multer from "multer";
import {s3Controller} from "../controllers/s3Controller.js"
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Increase file size limit to 50MB
});


router.post('/products/upload', upload.single('image') , s3Controller.uploadImage);
router.delete('/products/upload', s3Controller.deleteImage)




export default router