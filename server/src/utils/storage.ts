import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import fs from 'fs';

// Load env vars if not loaded
import dotenv from 'dotenv';
dotenv.config();

const storageProvider = process.env.STORAGE_PROVIDER || 'local';

let storage;

if (storageProvider === 'cloudinary') {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'caminacan_uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
            public_id: (req: any, file: any) => {
                const name = file.originalname.split('.')[0];
                return `${name}-${Date.now()}`;
            }
        } as any
    });
} else {
    // Fallback to local
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
        }
    });
}

export const upload = multer({ storage });
