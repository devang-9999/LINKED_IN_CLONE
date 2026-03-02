/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (
      _req: any,
      file: { originalname: string },
      callback: (arg0: null, arg1: string) => void,
    ) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

      callback(null, uniqueName + extname(file.originalname));
    },
  }),

  fileFilter: (req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Only image files are allowed'),
        false,
      );
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
