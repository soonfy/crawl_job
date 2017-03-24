/**
 *
 *  import models
 *
 */

import * as fs from 'fs';
import * as path from 'path';

import { camelCase, upperFirst } from 'lodash';

import * as mongoose from 'mongoose';

let modelFiles = fs.readdirSync(__dirname);
modelFiles = modelFiles.filter(file => !file.startsWith('.') && path.basename(file, path.extname(file)) !== 'index');

modelFiles.map(file => {
  let modelPath = path.join(__dirname, file);
  let modelName = upperFirst(camelCase(path.basename(file, path.extname(file))));
  let model = require(modelPath).default;
  global[modelName] = model;
  console.log(`[mongo] model <${modelName}> -> collection <${model.collection.collectionName}>`);
})

mongoose.promise = global.promise;

let dburi = `mongodb://localhost/jober`;
mongoose.connect(dburi);
console.log(`[mongo] connect <${dburi}> suc...`);


const connection = mongoose.connection
connection.on('connecting', console.error.bind(console, `[mongo] connection connecting...`))
connection.on('connected', console.log.bind(console, `[mongo] connection connected...`))
connection.on('error', console.error.bind(console, `[mongo] connection error...`))
connection.on('open', console.log.bind(console, `[mongo] connection open...`))
connection.on('close', console.log.bind(console, `[mongo] connection close...`))
connection.on('disconnecting', console.error.bind(console, `[mongo] connection disconnecting...`))
connection.on('disconnected', console.error.bind(console, `[mongo] connection disconnected...`))
connection.on('reconnected', console.error.bind(console, `[mongo] connection reconnected...`))

let test = async () => {
  try {
    let doc = {
      proxy: 123
    }
    await Proxy.uniSave(doc, console.log);
    setTimeout(async () => {
      await Proxy.uniSave(doc, console.log);
    }, 1000 * 10)
  } catch (error) {
    console.log(error);
  }
}

test();
