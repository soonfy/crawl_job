import * as LGCrawler from '../crawler/lg_crawler';
import Models from '../app/models/index';
import { concat, uniq } from 'lodash';

const {JobList, Company} = Models;
const {crawlPage, parseCity, getHotWord, getJobs} = LGCrawler.default;

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

const saveCompany = async (doc, opts = {}) => {
  if (!doc.crawlAt) {
    doc.crawlAt = new Date;
  }
  let _company = await Company.findOne({ companyId: doc.companyId });
  if (_company) {
    doc.sofrom = uniq(concat(doc.sofrom, _company.sofrom));
    doc.__v = ++_company.__v;
  }
  await Company.findOneAndUpdate({ companyId: doc.companyId }, doc, { upsert: true });
}

const start = async () => {
  try {
    let citys = (await parseCity()).commons;
    citys = Array.prototype.slice.call(citys);
    console.log(citys);
    for (let city of citys) {
      console.log(city);
      let kw = 'nodejs', pn = 1;
      let sofrom = [city, kw, pn].join('-+-');
      let job = await crawlPage(city, kw, pn);
      let {totalCount, resultSize} = job;
      console.log(`totalCount: ${totalCount}`);
      let promises = job.results.map(async data => {
        data.sofrom = sofrom;
        let _job = new JobList(data);
        await saveJob(_job);
        let _company = new Company(data);
        await saveCompany(_company);
      })
      await Promise.all(promises);
      while (resultSize <= totalCount) {
        console.log(`resultSize: ${resultSize}`);
        let job = await crawlPage(city, kw, ++pn);
        resultSize += job.resultSize;
        let promises = job.results.map(async data => {
          data.sofrom = sofrom;
          let _job = new JobList(data);
          await saveJob(_job);
          let _company = new Company(data);
          await saveCompany(_company);
        })
        await Promise.all(promises);
      }
      console.log(`${city} parse over...`);
    }
    console.log(`all citys over...`);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

start();
