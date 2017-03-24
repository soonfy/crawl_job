/**
 *
 * job info schema
 * 
 */

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const JobInfoSchema = new Schema({
  // 
}, { _id: false });

const JobInfo = mongoose.model('JobInfo', JobInfoSchema, 'jobinfos');

export default JobInfo;
