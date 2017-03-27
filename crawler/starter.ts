/**
 *  start crawl
 */

import * as Crawler from './lg_crawler';
import * as Parser from './lg_parser';

import { concat, uniq } from 'lodash';

/**
 *
 *  @description 休息
 *  @param {number} num
 *  @returns {null}
 *
 */
const sleep = (num: number) => {
  num = num * 1000;
  return new Promise((resolve) => {
    setTimeout(resolve, num);
  })
}

const saveJobList = async (job) => {
  try {
    let {cates, allJobs} = job;
    for (let category in allJobs) {
      for (let subcategory in allJobs[category]) {
        let jobs = allJobs[category][subcategory];
        let promises = jobs.map(async (name) => {
          let _job = await JobList.findOneAndUpdate({ category: category, subcategory: subcategory, name: name }, { $set: { category, subcategory, name, create: new Date } }, { upsert: true, new: true });
          console.log(_job);
        })
        await Promise.all(promises);
      }
    }
  } catch (error) {
    console.error(`[saveJobList] save job list error...`);
    console.error(error);
  }
}

const saveJob = async (doc, opts = {}) => {
  try {
    let job = new JobInfo(doc)
    if (!job.create) {
      job.create = new Date;
    }
    let _job = await JobInfo.findOne({ positionId: job.positionId });
    if (_job) {
      job.sofrom = uniq(concat(_job.sofrom, job.sofrom));
      job.__v = ++_job.__v;
    }
    job = await JobInfo.findOneAndUpdate({ positionId: job.positionId }, { $set: job }, { upsert: true, new: true });
    return job;
  } catch (error) {
    console.error(error);
  }
}

const saveJobInfo = async (doc, opts = {}) => {
  try {
    let job = new JobInfo(doc)
    if (!job.update) {
      job.update = new Date;
    }
    let _job = await JobInfo.findOne({ positionId: job.positionId });
    if (_job) {
      job = await JobInfo.findOneAndUpdate({ positionId: job.positionId }, { $set: job }, { upsert: true, new: true });
    } else {
      console.log(`job info no find job id...`);
    }
    return job;
  } catch (error) {
    console.error(error);
  }
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
  try {
    let company = new Company(doc);
    if (!company.create) {
      company.create = new Date;
    }
    let _company = await Company.findOne({ companyId: company.companyId });
    if (_company) {
      company.sofrom = uniq(concat(_company.sofrom, company.sofrom));
      company.__v = ++_company.__v;
    }
    company = await Company.findOneAndUpdate({ companyId: company.companyId }, { $set: company }, { upsert: true, new: true });
    return company;
  } catch (error) {
    console.error(error);
  }
}

const crawlCity = async () => {
  try {
    let data = await Crawler.default.cityCrawler();
    let citys = Parser.default.cityParser(data);
    console.log(citys);
  } catch (error) {
    console.error(`[crawlCity] crawl city error...`);
    console.error(error);
    return crawlCity();
  }
}

const crawlSearch = async () => {
  try {
    let data = await Crawler.default.searchCrawler();
    let searchs = Parser.default.searchParser(data);
    console.log(searchs);
  } catch (error) {
    console.error(`[crawlSearch] crawl search error...`);
    console.error(error);
    return crawlSearch();
  }
}

const crawlCategory = async () => {
  try {
    let data = await Crawler.default.homeCrawler();
    let category = Parser.default.categoryParser(data);
    console.log(category);
  } catch (error) {
    console.error(`[crawlCategory] crawl city error...`);
    console.error(error);
    return crawlCategory();
  }
}

const crawlJobList = async () => {
  try {
    let data = await Crawler.default.homeCrawler();
    let job = await Parser.default.jobParser(data);
    console.log(job);
    return job;
  } catch (error) {
    console.error(`[crawlJob] crawl city error...`);
    console.error(error);
    return crawlJobList();
  }
}

const startJobInfos = async (job, city) => {
  try {
    let uri = `https://www.lagou.com/jobs/positionAjax.json?city=${city}&needAddtionalResult=false`;
    let page = 1,
      first = true;
    first = page === 1 ? true : false;
    let form = { first, pn: page, kd: job };
    let data = await Crawler.default.jobSummaryCrawler(uri, form);
    let joblists = Parser.default.jobSummaryParser(data);
    let jobs = joblists.results;
    console.log(jobs);
    let promises = jobs.map(async doc => {
      doc.sofrom = [city, job].join('-+-');
      await saveJob(doc);
      await saveCompany(doc);
    })
    await Promise.all(promises);
    // promises = jobs.map(async doc => {
    //   let data = await Crawler.default.jobInfoCrawler(doc.positionId);
    //   doc.info = Parser.default.jobInfoParser(data);
    //   await saveJobInfo(doc);
    // })
    // await Promise.all(promises);
    for (let doc of jobs) {
      let data = await Crawler.default.jobInfoCrawler(doc.positionId);
      doc.info = Parser.default.jobInfoParser(data);
      await saveJobInfo(doc);
    }
    let {resultSize, totalCount} = joblists;
    console.log(totalCount);
    console.log(resultSize);
    while (resultSize < totalCount) {
      ++page;
      first = page === 1 ? true : false;
      let form = { first, pn: page, kd: job };
      let data = await Crawler.default.jobSummaryCrawler(uri, form);
      let joblists = Parser.default.jobSummaryParser(data);
      let jobs = joblists.results;
      console.log(jobs);
      let promises = jobs.map(async doc => {
        doc.sofrom = [city, job].join('-+-');
        await saveJob(doc);
        await saveCompany(doc);
      })
      await Promise.all(promises);
      // promises = jobs.map(async doc => {
      //   let data = await Crawler.default.jobInfoCrawler(doc.positionId);
      //   doc.info = Parser.default.jobInfoParser(data);
      //   await saveJobInfo(doc);
      // })
      // await Promise.all(promises);
      for (let doc of jobs) {
        let data = await Crawler.default.jobInfoCrawler(doc.positionId);
        doc.info = Parser.default.jobInfoParser(data);
        await saveJobInfo(doc);
      }
      resultSize += joblists.resultSize;
      console.log('resultSize', resultSize);
      await sleep(10);
    }
    console.log(`job suc...`);
  } catch (error) {
    console.error(error);
  }
}


// crawlCity();
// crawlSearch();
// crawlCategory();
// crawlJob();

const startJobList = async () => {
  try {
    let jobs = await crawlJobList();
    await saveJobList(jobs);
    console.log(`jobs over.`);
  } catch (error) {
    console.error(error);
  }
}

// startJobList();
startJobInfos('Java', '北京');
