import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as sass from 'node-sass';
import chalk from 'chalk';
import { executeCmd } from '../src/utils/execute-cmd';

interface ISection {
  label: string;
  key: string;
  subsections?: ISection[];
}

const sections: ISection[] = [
  {
    label: 'About',
    key: 'about'
  },
  {
    label: 'Projects',
    key: 'projects',
    subsections: [
      {
        label: 'Twiddy Ops Portal',
        key: 'twiddy-ops'
      }
    ]
  },
  {
    label: 'Blog',
    key: 'blog',
  },
  {
    label: 'Contact',
    key: 'contact'
  }
];

export const generate = () => {
  console.log(chalk.blueBright('Generating content...'));
  const layout = ({ rootPath, content, label, computedPath }: { rootPath: string; content: string; label: string; computedPath: string; }) => `
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>${label} | Luke Autry</title>
      <meta name="author" content="Luke Autry">

      <link href="https://fonts.googleapis.com/css?family=Gothic+A1:200|Ubuntu+Mono" rel="stylesheet">

      <link rel="stylesheet" href="/${computedPath}/index.css" type="text/css">
    </head>

    <body>
      <div class="fl co fh">
        <header class="fl sb vc">
          <div class="title">Luke Autry</div>
          <div class="links">
          ${sections.map(s => {
            return `<a class="${s.key === rootPath ? 'active' : ''}" href="/${s.key}">${s.label}</a>`;
            }).join('\n')}
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
      rimraf('./docs', {}, (err) => {
        if (err) { return j(err); }
        r();
      })
    });

    fs.mkdirSync('./docs');
    fs.copyFileSync('./src/favicon.ico', './docs/favicon.ico');
    await executeCmd('cp -r ./src/images docs')

    interface IRenderSectionParams {
      label: string;
      key: string;
      rootPath: string;
      computedPath: string;
    }

    const renderSection = async ({ label, rootPath, computedPath, key }: IRenderSectionParams) => {
      const content = fs.readFileSync(`./src/sections/${computedPath}/${key}.html`).toString();
      fs.mkdirSync(`./docs/${computedPath}`);

      const rendered = layout({
        rootPath,
        content,
        label,
        computedPath
      });

      fs.writeFileSync(`./docs/${computedPath}/index.html`, rendered);

      // compile sass
      let scssPath = `./src/sections/${computedPath}/${key}.scss`;
      if (!fs.existsSync(scssPath)) {
        scssPath = `./src/common/base.scss`;
      }

      const result = await new Promise<sass.Result>((r, j) => {
        sass.render({ file: scssPath, outputStyle: 'compressed' }, (err, result) => {
          if (err) { return j(err); }
          r(result);
        })
      });
      fs.writeFileSync(`./docs/${computedPath}/index.css`, result.css);
    }

    for (let section of sections) {
      await renderSection({
        label: section.label,
        key: section.key,
        rootPath: section.key,
        computedPath: section.key
      });

      if (section.subsections) {
        for (let subsection of section.subsections) {
          await renderSection({
            label: subsection.label,
            key: subsection.key,
            rootPath: section.key,
            computedPath: `${section.key}/${subsection.key}`
          });
        }
      }
    }
    console.log(chalk.greenBright('Generation success.'));
  })();
}

