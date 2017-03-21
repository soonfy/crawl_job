import crawlPage from '../crawler/lg_crawler';
import Models from '../app/models/index';
import { concat, uniq } from 'lodash';

const JobList = Models.JobList;

const saveJob = async (doc, opts = {}) => {
  if (!doc.crawlAt) {
    doc.crawlAt = new Date;
  }
  let _job = await JobList.findOne({ positionId: doc.positionId });
  if (_job) {
    doc.sofrom = uniq(concat(doc.sofrom, _job.sofrom));
    doc.__v = ++_job.__v;
  }
  await JobList.findOneAndUpdate({ positionId: doc.positionId }, doc, { upsert: true });
}

const start = async () => {
  let kw = ['北京', 'nodejs', 1];
  let sofrom = kw.slice(0, 2).join('+');
  let job = await crawlPage('北京', 'nodejs', 1);
  let promises = job.results.map(async data => {
    data.sofrom = sofrom;
    let _job = new JobList(data);
    await saveJob(_job);
  })
  await Promise.all(promises);
  console.log(`end...`);
  process.exit();
}

start();
