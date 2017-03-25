/**
 *  lagou parser
 */

/**
 *
 *  @description 输入可选参数，输出常用城市和所有城市
 *  @param {Object} [opts]
 *  @returns {Object} { commons, citys }
 *
 */
const cityParser = async ($, opts: Object = {}) => {
  try {
    let a = $('.common_city').eq(0).find('a');
    let commons: Array<string> = a.map((index, item) => $(item).text().trim());
    commons = Array.prototype.slice.call(commons);
    a = $('.word_list a');
    let citys: Array<string> = a.map((index, item) => $(item).text().trim());
    citys = Array.prototype.slice.call(citys);
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
const searchParser = async (body, opts: Object = {}) => {
  try {
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
 *  @description 输入DOM，可选参数，输出职位分类，热门职位
 *  @param {cheerio} $
 *  @param {Object} [opts]
 *  @returns {Object} { cates, commonJobs }
 *
 */
const categoryParser = async ($, opts: Object = {}) => {
  try {
    let h2 = $('.menu_main h2');
    let cates: Array<string> = [], commonJobs: Object = {};
    h2.map((index, item) => {
      let cate = $(item).text().trim();
      cates.push(cate);
      let jobs = $(item).nextAll('a').map((_index, _item) => $(_item).text().trim());
      jobs = Array.prototype.slice.call(jobs);
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
const jobParser = async ($, opts: Object = {}) => {
  try {
    let h2 = $('.menu_main h2');
    let cates: Array<string> = [], allJobs: Object = {};
    h2.map((index, item) => {
      let cate = $(item).text().trim();
      cates.push(cate);
      let temp = allJobs[cate] = {};
      $(item).parent().nextAll('.menu_sub').find('dt').map((_index, _item) => {
        let type = $(_item).text().trim();
        let jobs = $(_item).next().children('a').map((__index, __item) => $(__item).text().trim());
        jobs = Array.prototype.slice.call(jobs);
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

/**
 *
 *  @description 输入JSON对象，输出总数目，当前数目，当前结果
 *  @param {String} data
 *  @returns {Object} {totalCount, resultSize, results}
 *
 */
const jobSummaryParser = (data: string) => {
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

const jobInfoParser = ($, opts = {}) => {
  try {
    let info = $('.description+div>p').text();
    console.log(info);
    return info;
  } catch (error) {
    console.error(error);
  }
}

export default {
  cityParser,
  searchParser,
  categoryParser,
  jobParser,
  jobSummaryParser,
  jobInfoParser
}
