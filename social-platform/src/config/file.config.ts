import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs('files', () => ({
  uploadDir: process.env.UPLOAD_DIR || join(process.cwd(), 'uploads'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  allowedMimeTypes: (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/gif')
    .split(','),
}));
