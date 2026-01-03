import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

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
            // @ts-ignore
            public_id: (req, file) => {
                const name = file.originalname.split('.')[0];
                return `${name}-${Date.now()}`;
            }
        }
    });
} else {
    // Fallback to local
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/documents/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
}

export const upload = multer({ storage });
