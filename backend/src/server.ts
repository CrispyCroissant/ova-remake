import app from './app';
import logger from './config/logger';

const port: string = process.env.PORT || '4000';

app.listen(port, () => {
  logger.info(null, `Server has started!`)
});
