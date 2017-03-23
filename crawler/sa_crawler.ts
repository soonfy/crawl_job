import * as superagent from 'superagent';
import * as sp from 'superagent-proxy';

import headers from './header';

sp(superagent);

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

/**
 *
 *  @description 输入城市，关键词，页码，可选参数，输出职位数据
 *  @param {String} city
 *  @param {String} kd
 *  @param {String} kd
 *  @param {Number | String} pn
 *  @returns {Object} data
 *
 */
const crawlPage = async (city: string, kd: string, pn: number | string, opts: Object = {}) => {
  try {
    let uri = `https://www.lagou.com/jobs/positionAjax.json?city=${city}&needAddtionalResult=false`;
    let first = pn === 1 ? true : false;
    let form = {
      first,
      pn,
      kd
    }
    let time = Math.random() * 30;
    console.log(uri);
    console.log(form);
    console.log(`sleep ${time}`);
    await sleep(time);
    let proxy = 'http://124.229.105.237:80';
    try {
      let response = await superagent.post(uri).set(headers).type('application/x-www-form-urlencoded').send(form).proxy(proxy).timeout(60000);
      let data = response.text;
      console.log(data);
      return data;
    } catch (error) {
      console.error(`proxy request ${uri} error...`);
      console.error(error);
      console.error(error.code);
      if (error.code === 'ECONNABORTED') {
        return await crawlPage(city, kd, pn, opts);
      }
    }
  } catch (error) {
    console.error(`crawlPage error...`);
    console.error(error);
  }
}

if (module.parent === null) {
  crawlPage('北京', 'nodejs', 1);
}

export default {
  crawlPage
}
