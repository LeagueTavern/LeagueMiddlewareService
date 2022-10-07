import morgan, { StreamOptions } from "morgan";
import { log_logger } from './'

const stream: StreamOptions = {
  write: (message) => { log_logger(message.substring(0, message.length - 1), 'HTTP') },
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms from :remote-addr",
  { stream, skip }
);
