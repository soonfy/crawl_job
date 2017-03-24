/**
 *
 * cookie schema
 * 
 */

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CookieSchema = new Schema({
  cookie: {
    type: String
  },
  status: {
    type: Number
  },
  crawlAt: {
    type: Date
  }
})

const Cookie = mongoose.model('Cookie', CookieSchema, 'cookies');

export default Cookie;
