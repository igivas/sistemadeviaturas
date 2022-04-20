import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';

const initServer = async (): Promise<void> => {
  try {
    await createConnection();

    app.listen(process.env.PORT || 4003, () => {
      console.log(`🚀 Server started on port 4003`);
    });
  } catch (error) {
    console.log(error);
  }
};

initServer();
