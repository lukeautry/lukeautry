import express from 'express';
import ParcelBundler from 'parcel-bundler';
import path from 'path';

export const startServer = async () => {
  await new ParcelBundler(path.join(__dirname, './src/index.html'), {
    outDir: path.join(__dirname, './dist'),
  }).bundle();

  const app = express();

  const editorPort = 1339;
  app.listen(editorPort, () => {
    console.log(`Blog editor listening at http://localhost:${editorPort}`);
  })
}
