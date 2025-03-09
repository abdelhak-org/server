import { Router as router } from "express";
import upload from '../../s3Config.js';


router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ fileUrl: req.file.location });
});

export default router;
