/**
 *
 * proxy schema
 * 
 */

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProxySchema = new Schema({
  proxy: {
    type: String
  },
  status: {
    type: Number
  },
  crawlAt: {
    type: Date
  }
}, { _id: false });

ProxySchema.static('uniSave', async (doc, cb) => {
  try {
    let _self = this.default;
    if (!('crawlAt' in doc)) {
      doc.crawlAt = new Date;
    }
    console.log(doc);
    // let _proxy = await _self.findOne({ proxy: doc.proxy }, doc, {upsert: true});
  } catch (error) {
    (cb || console.log)(error);
  }
})

const Proxy = mongoose.model('Proxy', ProxySchema, 'proxys');

export default Proxy;
