import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import limiter from '../src/middlewares/request-limit.js';
import unmaskRoutes from '../src/routes/unmask.routes.js';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: '10mb' })); // 👈 base64
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(limiter);
};

const routes = (app) => {
  app.use('/api/unmask', unmaskRoutes);

 
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
};

export const initServer = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  try {
    middlewares(app);
    routes(app);

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.log(`server init failed: ${error}`);
  }
};
