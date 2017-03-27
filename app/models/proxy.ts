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
  create: {
    type: Date
  }
}, { _id: false });

ProxySchema.static('uniSave', async (doc, cb) => {
  try {
    let _self = this.default;
    let _proxy = await _self.findOneAndUpdate({ proxy: doc.proxy }, doc, { upsert: true, new: true });
    console.log(_proxy);
    await cb(null, _proxy);
  } catch (error) {
    console.error(`[proxyschema] unisave <${doc.proxy}> error...`);
    (cb || console.log)(error);
  }
})

const Proxy = mongoose.model('Proxy', ProxySchema, 'proxys');

export default Proxy;
