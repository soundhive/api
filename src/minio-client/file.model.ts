export interface BufferedFile {
  fieldname: string;

  originalname: string;

  encoding: string;

  size: number;

  buffer: Buffer | string;

  mimetype: string;
}
