export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  size: number;
  buffer: Buffer | string;
  mimetype: string;
}

export interface ImageFile extends BufferedFile {
  mimetype: 'image/png' | 'image/jpeg';
}

export interface AudioFile extends BufferedFile {
  mimetype: '"audio/flac' | 'audio/mpeg' | 'audio/ogg' | 'audio/wav';
}
