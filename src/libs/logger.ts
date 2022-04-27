import { Hellog, transports } from '@steffthestunt/hellog';
import { env } from 'app/libs/environment';

const usedTransports = [new transports.Console()];

if (env.logFile) {
  usedTransports.push(
    new transports.FileTransport({ filename: process.env.LOG_FILE }),
  );
}

export const logger = new Hellog({
  transports: usedTransports,
});
