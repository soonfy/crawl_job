/**
 *  lagou crawler
 */

import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

import headers from './header';

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
    setTimeout(resolve(), num);
  })
}

/**
 *
 *  @description 输入JSON对象，输出总数目，当前数目，当前结果
 *  @param {String} data
 *  @returns {Object} {totalCount, resultSize, results}
 *
 */
const dataParser = (data: string) => {
  try {
    let positionResult = JSON.parse(data).content.positionResult;
    let totalCount = positionResult.totalCount;
    let resultSize = positionResult.resultSize;
    let results = positionResult.result;
    console.log(totalCount);
    console.log(resultSize);
    let job: {
      totalCount: number,
      resultSize: number,
      results: Array<Object>
    } = {
      totalCount,
      resultSize,
      results
    }
    return job;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *  @description 输入城市，关键词，页码，可选参数，调用dataParser，输出dataParser返回结果
 *  @param {String} city
 *  @param {String} kd
 *  @param {String} kd
 *  @param {Number | String} pn
 *  @returns {Object} {totalCount, resultSize, results}
 *
 */
const crawlPage = async (city: string, kd: string, pn: number | string, opts: Object = {}) => {
  try {
    let uri = `https://www.lagou.com/jobs/positionAjax.json?city=${city}&needAddtionalResult=false`;
    let options = {
      method: 'post',
      uri,
      form: {
        first: 'false',
        pn,
        kd
      },
      headers
    }
    await sleep(Math.random() * 30);
    let data = await rp(options);
    let job: {
      totalCount: number,
      resultSize: number,
      results: Array<Object>
    } = dataParser(data);
    console.log(job);
    return job;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *  @description 输入可选参数，输出常用城市和所有城市
 *  @param {Object} [opts]
 *  @returns {Object} { commons, citys }
 *
 */
const parseCity = async (opts: Object = {}) => {
  try {
    let uri = `https://www.lagou.com/jobs/allCity.html`;
    let options = {
      method: 'get',
      uri,
      headers
    }
    await sleep(Math.random() * 30);
    let body = await rp(options);
    let $ = cheerio.load(body);
    let a = $('.common_city').eq(0).find('a');
    let commons: Array<string> = a.map((index, item) => $(item).text().trim());
    a = $('.word_list a');
    let citys: Array<string> = a.map((index, item) => $(item).text().trim());
    console.log(commons);
    console.log(citys);
    return { commons, citys };
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *  @description 输入可选参数，输出热门搜索词
 *  @param {Object} [opts]
 *  @returns {Array} hotwords
 *
 */
const getHotWord = async (opts: Object = {}) => {
  try {
    let uri = `https://service.lagou.com/hotword?callback`;
    let options = {
      method: 'get',
      uri,
      headers
    }
    await sleep(Math.random() * 30);
    let body = await rp(options);
    let reg = /\(([\w\W]+)\)\;/;
    body = reg.exec(body)[1];
    let obj = JSON.parse(body);
    let hotwords: Array<Object> = obj.hotwords;
    console.log(hotwords);
    return hotwords;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *  @description 输入可选参数，输出cheerio封装的DOM
 *  @param {Object} [opts]
 *  @returns {cheerio} $
 *
 */
const getHome = async (opts: Object = {}) => {
  try {
    let uri = `https://www.lagou.com/`;
    let options = {
      method: 'get',
      uri,
      headers
    }
    await sleep(Math.random() * 30);
    let body = await rp(options);
    let $: cheerio = cheerio.load(body);
    return $;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *  @description 输入DOM，可选参数，输出职位分类，热门职位
 *  @param {cheerio} $
 *  @param {Object} [opts]
 *  @returns {Object} { cates, commonJobs }
 *
 */
const getCategorys = async ($: cheerio, opts: Object = {}) => {
  try {
    $ = $ || await getHome();
    let h2 = $('.menu_main h2');
    let cates: Array<string> = [], commonJobs: Object = {};
    h2.map((index, item) => {
      let cate = $(item).text().trim();
      cates.push(cate);
      let jobs = $(item).nextAll('a').map((_index, _item) => $(_item).text().trim());
      commonJobs[cate] = jobs;
    })
    console.log(cates);
    console.log(commonJobs);
    return { cates, commonJobs };
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *  @description 输入DOM，可选参数，输出职位分类，所有职位
 *  @param {cheerio} $
 *  @param {Object} [opts]
 *  @returns {Object} { cates, allJobs }
 *
 */
const getJobs = async ($: cheerio, opts: Object = {}) => {
  try {
    $ = $ || await getHome();
    let h2 = $('.menu_main h2');
    let cates: Array<string> = [], allJobs: Object = {};
    h2.map((index, item) => {
      let cate = $(item).text().trim();
      cates.push(cate);
      let temp = allJobs[cate] = {};
      $(item).parent().nextAll('.menu_sub').find('dt').map((_index, _item) => {
        let type = $(_item).text().trim();
        let jobs = $(_item).next().children('a').map((__index, __item) => $(__item).text().trim());
        temp[type] = jobs;
      })
    })
    console.log(cates);
    console.log(allJobs);
    return { cates, allJobs };
  } catch (error) {
    console.error(error);
  }
}

if (module.parent === null) {
  // crawlPage('北京', 'nodejs', 1);
  // parseCity();
  // getHotWord();
  // getCategorys('');
  // getJobs('');
}

export default {
  crawlPage,
  parseCity,
  getHotWord,
  getCategorys,
  getJobs
}
