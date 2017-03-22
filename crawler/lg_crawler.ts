/**
 *  lagou crawler
 */

import * as rp from 'request-promise';
import headers from './header';
import * as cheerio from 'cheerio';

const sleep = (num) => {
  num = num * 1000;
  return new Promise((resolve) => {
    setTimeout(resolve(), num);
  })
}

const dataParser = (data) => {
  try {
    let positionResult = JSON.parse(data).content.positionResult;
    let totalCount = positionResult.totalCount;
    let resultSize = positionResult.resultSize;
    let results = positionResult.result;
    return {
      totalCount,
      resultSize,
      results
    }
  } catch (error) {
    console.error(error);
  }
}


const crawlPage = async (city, kd, pn, opts = {}) => {
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
    let job = dataParser(data);
    console.log(job);
    return job;
  } catch (error) {
    console.error(error);
  }
}

const parseCity = async () => {
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
    let commons = a.map((index, item) => $(item).text().trim());
    a = $('.word_list a');
    let citys = a.map((index, item) => $(item).text().trim());
    console.log(commons);
    console.log(citys);
    return { commons, citys };
  } catch (error) {
    console.error(error);
  }
}

const getHotWord = async () => {
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
    let hotwords = obj.hotwords;
    console.log(hotwords);
    return hotwords;
  } catch (error) {
    console.error(error);
  }
}

const getHome = async () => {
  try {
    let uri = `https://www.lagou.com/`;
    let options = {
      method: 'get',
      uri,
      headers
    }
    await sleep(Math.random() * 30);
    let body = await rp(options);
    let $ = cheerio.load(body);
    return $;
  } catch (error) {
    console.error(error);
  }
}

const getCategorys = async ($) => {
  try {
    $ = $ || await getHome();
    let h2 = $('.menu_main h2');
    let cates = [], commonJobs = {};
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

const getJobs = async ($) => {
  try {
    $ = $ || await getHome();
    let h2 = $('.menu_main h2');
    let cates = [], allJobs = {};
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

export default {
  crawlPage,
  parseCity,
  getHotWord,
  getCategorys,
  getJobs
}

// crawlPage('北京', 'nodejs', 1);
// parseCity();
getHotWord();
// getCategorys('');
// getJobs('');
