import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the path to the 'public' directory
const publicDir = path.resolve(__dirname, '../public');

// Configure storage using Multer's diskStorage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use the resolved path to the 'public' directory
        cb(null, publicDir);
    },
    filename: (req, file, cb) => {
        // Use the original filename
        cb(null, file.originalname);
    }
});

// Create a multer upload middleware for multiple fields
const upload = multer({
    storage,
    // limits: { fileSize: 1024 * 1024 * 5 }, // Optional: Limit file size to 5MB
});

// Define the upload.fields() middleware for multiple files
const uploadFiles = upload.fields([
    { name: 'profileImage', maxCount: 1 } // Single file for profile image
]);

export default uploadFiles;
