import express from 'express';
import dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import accountRouter from './router/account.js';
import CookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT;

app.use(CookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('client'));
app.use('/api', accountRouter);
initSocket(server);

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // 이곳에서 파일 읽음
  try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets loaded successfully');
  } catch (e) {
    console.error('Failed to load game assets: ', e);
  }
});
