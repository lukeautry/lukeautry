import path from "path";
import Showdown from "showdown";
import chalk from "chalk";
import { writeFile } from "./write-file";
import { BlogService } from "../blog-editor/api/blog-service";
import rimraf from "rimraf";

// eslint-disable-next-line
const highlight: Showdown.ShowdownExtension = require("showdown-highlight");

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  extensions: [highlight]
});

export const generateBlog = async () => {
  console.log(chalk.blue("Generating blog content..."));
  const data = await new BlogService().getPosts();
  const posts = Object.values(data);

  const blogHome = `
    <div class="blog-list">
      ${posts
        .map(post => {
          return `
            <a class="blog-list-item card" href="/blog/${post.slug}">
              <div class="blog-list-item-title">${post.title}</div>
              <div class="blog-list-item-description">
                ${post.description}
              </div>
            </a>
          `;
        })
        .join("")}
    </div>
  `;

  await new Promise((r, j) => {
    rimraf(path.join(__dirname, "../src/sections/blog"), {}, err => {
      if (err) {
        return j(err);
      }
      r();
    });
  });

  await writeFile(
    path.join(__dirname, "../src/sections/blog/blog.html"),
    blogHome
  );

  await Promise.all(
    Object.values(data).map(async post => {
      const output = path.join(
        __dirname,
        `../src/sections/blog/${post.slug}/${post.slug}.html`
      );

      await writeFile(
        output,
        `
        <div class="post">
          <h1 class="post-title">${post.title}</h1>
          <div class="post-description">${post.description}</div>
          ${converter.makeHtml(post.content)}
        </div>
      `
      );
    })
  );
  console.log(chalk.green("Generated blog content success."));
};
