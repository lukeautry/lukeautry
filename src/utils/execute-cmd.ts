import * as childProcess from 'child_process';

export const executeCmd = (command: string) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (exception, out, err) => {
      if (exception) { return reject(exception); }

      if (err) {
        console.error(err);
        reject(err);
      }

      console.log(out)
      resolve();
    });
  });
};
