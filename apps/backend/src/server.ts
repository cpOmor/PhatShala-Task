/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import http from 'http';
import cookieParser from 'cookie-parser';
import { databaseConnecting } from './app/config/database.config';
import config from './app/config';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import router from './app/routes';

const app: Application = express();
const server = http.createServer(app);

app.use(express.json());


const corsOptions = {
  origin: async (origin: any, callback: any) => {
    try {
      callback(null, true);
      // const allowed = await checkOrigin(origin);
      // if (allowed) {
      //   callback(null, true);
      // } else {
      //   callback(new Error('Not allowed by CORS'));
      // }
    } catch (error) {
      callback(error);
    }
  },
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'superAuth',
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.use(
  session({
    secret: config.jwt_access_secret as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  }),
);

app.use(cors(corsOptions));

app.set('trust proxy', true);

app.use(cookieParser());

databaseConnecting();

const startServer = (req: Request, res: Response) => {
  try {
    res.send(`${config.wel_come_message}`);
  } catch (error) {
    console.log('server not start');
  }
};
app.get('/', startServer);


app.use('/api/v1', router);

// Importing routes
app.use(notFound);
app.use(globalErrorHandler);


server.listen(config.port, () => {
  console.log(`Local         :👉 http://localhost:${config.port}/`);
});
