/**
 *  import models
 */

import * as mongoose from 'mongoose';

import JobList from './job_list';
import Company from './company';
import IP from './ip';

mongoose.promise = global.promise;

let dburi = `mongodb://localhost/jober`;
mongoose.connect(dburi);
console.log(`[mongo] connect suc...`);
console.log(`[mongo] model ${JobList.modelName} collection ${JobList.collection.collectionName}`);
console.log(`[mongo] model ${Company.modelName} collection ${Company.collection.collectionName}`);
console.log(`[mongo] model ${IP.modelName} collection ${IP.collection.collectionName}`);
const db = mongoose.connection
db.on('error', console.error.bind(console, `[mongo] connect err...`))
db.once('open', () => {
  console.log('[mongo] open suc...')
})

export default {
  JobList,
  Company,
  IP
}
