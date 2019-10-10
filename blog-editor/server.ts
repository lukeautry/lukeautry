import express from "express";
import ParcelBundler from "parcel-bundler";
import path from "path";
import { BlogService } from "./api/blog-service";
import bodyParser from "body-parser";

export const startServer = async () => {
  await new ParcelBundler(path.join(__dirname, "./src/index.html"), {
    outDir: path.join(__dirname, "./dist"),
    hmr: false
  }).bundle();

  const app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json());

  app.use("/", express.static(path.join(__dirname, "./dist")));

  const renderError = (error: Error, res: express.Response) => {
    res.status(500);
    res.json({
      error: error.message
    });
  };

  app.get("/posts", async (_req, res) => {
    try {
      res.send(await new BlogService().getPosts());
    } catch (err) {
      renderError(err, res);
    }
  });

  app.post("/posts", async (req, res) => {
    try {
      const result = await new BlogService().createPost(req.body);
      res.json(result);
    } catch (err) {
      renderError(err, res);
    }
  });

  app.patch("/posts", async (req, res) => {
    try {
      const result = await new BlogService().updatePost(req.body);
      res.json(result);
    } catch (err) {
      renderError(err, res);
    }
  });

  app.delete("/posts", async (req, res) => {
    try {
      await new BlogService().deletePost(req.query.id);
      res.send("ok");
    } catch (err) {
      renderError(err, res);
    }
  });

  const editorPort = 1339;
  app.listen(editorPort, () => {
    console.log(`Blog editor listening at http://localhost:${editorPort}`);
  });
};
