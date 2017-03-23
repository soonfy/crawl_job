import * as LGCrawler from '../crawler/lg_crawler';
import * as SACrawler from '../crawler/sa_crawler';

import Models from '../app/models/index';

import { concat, uniq } from 'lodash';

const {JobList, Company} = Models;
const {dataParser, parseCity, getHotWord, getJobs} = LGCrawler.default;
const {crawlPage} = SACrawler.default;

/**
 *
 *  @description 输入职位信息，可选参数，输出存储的职位
 *  @param {Object} doc
 *  @param {Object} [opts]
 *  @returns {Object} job
 *
 */
const saveJob = async (doc, opts = {}) => {
  let job = new JobList(doc)
  if (!job.crawlAt) {
    job.crawlAt = new Date;
  }
  let _job = await JobList.findOne({ positionId: job.positionId });
  if (_job) {
    job.sofrom = uniq(concat(_job.sofrom, job.sofrom));
    job.__v = ++_job.__v;
  }
  await JobList.findOneAndUpdate({ positionId: job.positionId }, job, { upsert: true });
  return job;
}

/**
 *
 *  @description 输入公司信息，可选参数，输出存储的公司
 *  @param {Object} doc
 *  @param {Object} [opts]
 *  @returns {Object} company
 *
 */
const saveCompany = async (doc, opts = {}) => {
  let company = new Company(doc);
  if (!company.crawlAt) {
    company.crawlAt = new Date;
  }
  let _company = await Company.findOne({ companyId: company.companyId });
  if (_company) {
    company.sofrom = uniq(concat(_company.sofrom, company.sofrom));
    company.__v = ++_company.__v;
  }
  await Company.findOneAndUpdate({ companyId: company.companyId }, company, { upsert: true });
  return company;
}

/**
 *
 *  @description 采集入口
 *
 */
const start = async () => {
  try {
    // let citys = (await parseCity()).commons;
    let citys = ['北京'];
    citys = Array.prototype.slice.call(citys);
    console.log(citys);
    let index = 0;
    for (let city of citys) {
      console.log(city);
      ++index;
      // if (index <= 1) {
      //   continue;
      // }
      let kw = 'nodejs', pn = 1;
      let sofrom = [city, kw, pn].join('-+-');
      let data = await crawlPage(city, kw, pn)
      let job = dataParser(data);
      let {totalCount, resultSize} = job;
      console.log(`totalCount: ${totalCount}`);
      let promises = job.results.map(async (data: {
        sofrom: string
      }) => {
        data.sofrom = sofrom;
        await saveJob(data);
        await saveCompany(data);
      })
      await Promise.all(promises);
      while (resultSize < totalCount) {
        console.log(`resultSize: ${resultSize}`);
        pn += 1;
        console.info(pn);
        let data = await crawlPage(city, kw, pn)
        let job = dataParser(data);
        resultSize += job.resultSize;
        let promises = job.results.map(async (data: {
          sofrom: string
        }) => {
          data.sofrom = sofrom;
          await saveJob(data);
          await saveCompany(data);
        })
        await Promise.all(promises);
      }
      console.log(`${city} parse over...`);
      process.exit();
    }
    console.log(`all citys over...`);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

start();
