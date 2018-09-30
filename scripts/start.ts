import * as chokidar from 'chokidar';
import { generate } from './gen';
import * as nodeStatic from 'node-static';
import * as http from 'http';
import chalk from 'chalk';

const watcher = chokidar.watch('./src/**/*', {
  persistent: true
});

watcher.on('change', path => {
  generate();
})

generate();

const content = new nodeStatic.Server('./dist');

const port = 64536;
http.createServer((request, response) => {
  request.addListener('end', () => {
    content.serve(request, response);
  }).resume();
}).listen(port);

console.log(chalk.greenBright(`Dev server at http://localhost:${port}`));
