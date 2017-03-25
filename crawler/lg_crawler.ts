/**
 *  lagou crawler
 */

import * as cheerio from 'cheerio';
import * as reptiler from './reptiler';

const cityCrawler = async (uri = `https://www.lagou.com/jobs/allCity.html`, opts = {}) => {
  try {
    let body = await reptiler.default.getReptiler(uri, true);
    console.log(body);
    let $ = cheerio.load(body);
    return $;
  } catch (error) {
    console.error(`[cityCrawler] crawl city <${uri}> error...`);
    console.error(error);
    return await cityCrawler(uri, opts = {});
  }
}

const searchCrawler = async (uri = `https://service.lagou.com/hotword?callback`, opts = {}) => {
  try {
    let body = await reptiler.default.getReptiler(uri, true);
    console.log(body);
    return body;
  } catch (error) {
    console.error(`[searchCrawler] crawl search <${uri}> error...`);
    console.error(error);
    return await searchCrawler(uri, opts = {});
  }
}

const homeCrawler = async (uri = `https://www.lagou.com/`, opts = {}) => {
  try {
    let body = await reptiler.default.getReptiler(uri, true);
    console.log(body);
    let $: cheerio = cheerio.load(body);
    return $;
  } catch (error) {
    console.error(`[homeCrawler] crawl home <${uri}> error...`);
    console.error(error);
    return await homeCrawler(uri, opts = {});
  }
}

const jobSummaryCrawler = async (uri, form, opts = {}) => {
  try {
    let body = await reptiler.default.postReptiler(uri, form, true);
    console.log(body);
    return body;
  } catch (error) {
    console.error(`[jobSummaryCrawler] crawl job summary <${uri}> error...`);
    console.error(error);
    return await jobSummaryCrawler(uri, form, opts = {});
  }
}

const jobInfoCrawler = async (jobid, opts = {}) => {
  try {
    let uri = `https://www.lagou.com/jobs/${jobid}.html`;
    let body = await reptiler.default.getReptiler(uri, true);
    console.log(body);
    let $ = cheerio.load(body)
    return $;
  } catch (error) {
    console.error(`[jobInfoCrawler] crawl job infos <${jobid}> error...`);
    console.error(error);
    return await jobInfoCrawler(jobid, opts);
  }
}

if (!module.parent) {
  // cityCrawler();
  // searchCrawler();
  // homeCrawler();
  // jobSummaryCrawler('https://www.lagou.com/jobs/positionAjax.json?city=北京&needAddtionalResult=false', { first: true, pn: 1, kd: '自然语言处理' });
  // jobInfoCrawler(1302845);
}

export default {
  cityCrawler,
  searchCrawler,
  homeCrawler,
  jobSummaryCrawler,
  jobInfoCrawler
}
