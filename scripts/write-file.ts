import path from "path";
import { promises as fs } from "fs";

const checkDir = async (dir: string) => {
  const exists = await fs
    .access(dir)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    await fs.mkdir(dir, {
      recursive: true
    });
  }
};

export const writeFile = async (
  writePath: string,
  content: string | Buffer
) => {
  const dir = path.dirname(writePath);
  await checkDir(dir);

  await fs.writeFile(writePath, content);
};

export const copyFile = async (src: string, dest: string) => {
  const dir = path.dirname(dest);
  await checkDir(dir);

  await fs.copyFile(src, dest);
};
