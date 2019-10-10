import fs from "fs";
import rimraf from "rimraf";
import sass from "node-sass";
import chalk from "chalk";
import { executeCmd } from "../src/utils/execute-cmd";
import { BlogService } from "../blog-editor/api/blog-service";
import { copyFile, writeFile } from "./write-file";

interface ISection {
  label: string;
  key: string;
  subsections?: ISection[];
  index?: boolean;
  css?: string;
}

export const generate = async () => {
  const data = await new BlogService().getPosts();

  const sections: ISection[] = [
    {
      label: "About",
      key: "about"
    },
    {
      label: "Projects",
      key: "projects",
      subsections: [
        {
          label: "Twiddy Ops Portal",
          key: "twiddy-ops"
        }
      ],
      index: true
    },
    {
      label: "Blog",
      key: "blog",
      index: true,
      subsections: Object.values(data).map(post => {
        return {
          label: post.title,
          key: post.slug,
          css: "./src/common/post.scss",
          highlight: true
        };
      }),
      css: "./src/common/blog.scss"
    },
    {
      label: "Contact",
      key: "contact"
    }
  ];

  console.log(chalk.blueBright("Generating content..."));
  const layout = ({
    rootPath,
    content,
    label,
    computedPath
  }: {
    rootPath: string;
    content: string;
    label: string;
    computedPath: string;
  }) => `
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${label} | Luke Autry</title>
      <meta name="author" content="Luke Autry">

      <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="/${computedPath}/index.css" type="text/css">
      
    </head>

    <body>
      <div class="fl co fh">
        <header class="fl jc">
          <div class="inner-header fl sb vc">
            <div class="title">Luke Autry</div>
            <div class="links">
            ${sections
              .map(s => {
                return `<a class="${
                  s.key === rootPath ? "active" : ""
                }" href="/${s.key}">${s.label}</a>`;
              })
              .join("\n")}
            </div>
          </div>
        </header>
        <div class="fl jc grow oa">
          <div class="content">
            ${content}
          </div>
        </div>
      </div>
    </body>

    </html>`;

  (async () => {
    await new Promise((r, j) => {
      rimraf("./dist", {}, err => {
        if (err) {
          return j(err);
        }
        r();
      });
    });

    await copyFile("./src/favicon.ico", "./dist/favicon.ico");
    await executeCmd("cp -r ./src/assets dist");

    interface IRenderSectionParams {
      label: string;
      key: string;
      rootPath: string;
      computedPath: string;
      css?: string;
      index?: boolean;
    }

    const renderSection = async ({
      label,
      rootPath,
      computedPath,
      key,
      index,
      css
    }: IRenderSectionParams) => {
      const content = fs
        .readFileSync(`./src/sections/${computedPath}/${key}.html`)
        .toString();

      const rendered = layout({
        rootPath,
        content,
        label,
        computedPath
      });

      await writeFile(`./dist/${computedPath}/index.html`, rendered);

      if (index) {
        await writeFile(`./dist/index.html`, rendered);
      }

      let scssPath = `./src/sections/${computedPath}/${key}.scss`;
      if (css) {
        scssPath = css;
      } else if (!fs.existsSync(scssPath)) {
        scssPath = `./src/common/base.scss`;
      }

      const result = await new Promise<sass.Result>((r, j) => {
        sass.render(
          { file: scssPath, outputStyle: "compressed" },
          (err, result) => {
            if (err) {
              return j(err);
            }
            r(result);
          }
        );
      });
      await writeFile(`./dist/${computedPath}/index.css`, result.css);

      if (index) {
        await writeFile(`./dist/index.css`, result.css);
      }
    };

    for (const section of sections) {
      await renderSection({
        label: section.label,
        key: section.key,
        rootPath: section.key,
        computedPath: section.key,
        index: section.index,
        css: section.css
      });

      if (section.subsections) {
        for (const subsection of section.subsections) {
          await renderSection({
            label: subsection.label,
            key: subsection.key,
            rootPath: section.key,
            computedPath: `${section.key}/${subsection.key}`,
            css: subsection.css
          });
        }
      }
    }
    console.log(chalk.greenBright("Generation success."));
  })();
};
