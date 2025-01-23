import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
// export const multerConfig = {
//     dest: process.env.FILEUPLOAD_LOCATION,
// };

// Multer upload options
export const multerOptions = {
    // Enable file size limits
    // limits: {
    //     // fileSize: +process.env.FILEUPOAD_SIZE_LIMIT,
    //     fileSize: +process.env.FILEUPOAD_SIZE_LIMIT
    // },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(csv|xlsx)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
};