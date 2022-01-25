import express from 'express';
import logger from '../utils/logger';
import mrMiddleware from './middlewares/merge-requests';

export type WebhookRequest = Express.Request & { body: any };

export class GitlabServer {
  _app: express.Application;

  constructor() {
    const app = express();
    this._app = app;

    app.use(express.json());
    app.use((req: WebhookRequest, res, next) => {
      logger.debug('-------------------------');
      logger.debug(JSON.stringify(req.body, null, 2));
      logger.debug('-------------------------');
      return next();
    });
    app.use(mrMiddleware);
  }

  async listen(port: number) {
    return new Promise((resolve, reject) => {
      this._app
        .listen(port, () => {
          logger.info(`Server listening on port: ${port}`);
          resolve(void 0);
        })
        .on('error', (err) => reject(err));
    });
  }
}
