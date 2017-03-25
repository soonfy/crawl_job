/**
 *
 * job list schema
 * 
 */

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const JobListSchema = new Schema({
  category: {
    type: String
  },
  subcategory: {
    type: String
  },
  name: {
    type: String
  },
  create: {
    type: Date
  },
  update: {
    type: Date
  }
});

const JobList = mongoose.model('JobList', JobListSchema, 'job_lists');

export default JobList;
