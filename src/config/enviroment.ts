import dotenv from 'dotenv';
import path from 'path';

export default dotenv.config({
  path: path.join(
    __dirname,
    '..',
    '..',
    process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
  ),
});
