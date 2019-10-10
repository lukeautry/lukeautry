import * as chokidar from "chokidar";
import { generate } from "./generate";
import { Server } from "node-static";
import http from "http";
import chalk from "chalk";
import { startServer } from "../blog-editor/server";
import { generateBlog } from "./generate-blog";
import { debounce } from "./debounce";

(async () => {
  await startServer();

  const dataWatcher = chokidar.watch("./blog-editor/data.json", {
    persistent: true
  });
  await generateBlog();

  const srcWatcher = chokidar.watch("./src/**/*", {
    persistent: true
  });

  await generate();

  dataWatcher.on("change", debounce(() => generateBlog(), 250));
  srcWatcher.on("change", debounce(() => generate(), 250));

  const content = new Server("./dist");

  const port = 64536;
  http
    .createServer((request, response) => {
      request
        .addListener("end", () => {
          content.serve(request, response);
        })
        .resume();
    })
    .listen(port);

  console.log(chalk.greenBright(`Site at http://localhost:${port}`));
})();
