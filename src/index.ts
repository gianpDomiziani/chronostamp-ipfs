import * as path from 'path';
import { Express, Request, Response, NextFunction } from 'express';
const express = require('express');

import cors from 'cors';
import bodyParser from 'body-parser';

import { PORT } from './config';
import { MyIPFS } from './ipfs';

const app: Express = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());

const port = PORT || 8110;
app.listen(port, async () => {
  console.log(`IPFS Service is running on port ${port}`);
});

app.get('/api/v0/makeAsset/:id', makeAsset);
app.get('/api/v0/getAsset/:id', getAsset);
app.get('/api/v0/getCID/enrico/:id', getCID);

// API Functions
MyIPFS.start();

async function makeAsset(req: Request, res: Response, next: NextFunction) {
  let a = await MyIPFS.makeAsset(req.params.id);
  let asset = JSON.parse(a);
  console.log(`Asset : ${asset}`);
  res.json(asset);
}

async function getAsset(req: Request, res: Response, next: NextFunction) {

     let g = await MyIPFS.getAsset(req.params.id)

     console.log('G: ', g)

     let content = g.toString()

     res.send(content)
    }

async function getCID(req: Request, res: Response, next: NextFunction) {

  
  const stats = await MyIPFS.getCID('/enrico/' + req.params.id)
  console.log('API CID: ', stats['cid'])

  let cid = stats['cid']
  res.send(cid)

}
