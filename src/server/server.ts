import express from 'express';
import mrMiddleware from './middlewares/merge-requests';

export type WebhookRequest = Express.Request & { body: any };

export class GitlabServer {
  _app: express.Application;

  constructor() {
    const app = express();
    this._app = app;

    app.use(express.json());
    app.use((req: WebhookRequest, res, next) => {
      console.log('-------------------------');
      console.log(JSON.stringify(req.body, null, 2));
      console.log('-------------------------');
      return next();
    });
    app.use(mrMiddleware);
  }

  async listen(port: number) {
    return new Promise((resolve, reject) => {
      this._app
        .listen(port, () => {
          console.log('Server listening on port', port);
          resolve(void 0);
        })
        .on('error', (err) => reject(err));
    });
  }
}
