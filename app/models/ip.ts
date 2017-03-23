/**
 * ip schema
 * 
 */

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const IPSchema = new Schema({
  proxy: {
    type: String
  },
  status: {
    type: Number
  },
  crawlAt: {
    type: Date
  }
})

const IP = mongoose.model('IP', IPSchema, 'ips');

export default IP;
