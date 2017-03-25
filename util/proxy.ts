import * as cheerio from 'cheerio';
import * as rp from 'request-promise';

/**
 *
 *  @description 输入proxy网站采集页数，输出proxy列表
 *  @param {Number} pn
 *  @returns {Array} proxys
 *
 */
const getProxy = async (pn = 1) => {
  try {
    let uri = `http://www.xicidaili.com/nn/${pn}`;

    let options = {
      uri,
      method: 'get',
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
      }
    }
    let body = await rp(options);
    let $ = cheerio.load(body);
    let proxys: Array<string> = [];
    $('tr.odd').map((_index, _item) => {
      let proxy = [];
      proxy.push($(_item).children('td').eq(1).text().trim());
      proxy.push($(_item).children('td').eq(2).text().trim());
      proxys.push(proxy.join('\t'));
      proxy = [];
      proxy.push($(_item).next('tr').children('td').eq(1).text().trim());
      proxy.push($(_item).next('tr').children('td').eq(2).text().trim());
      proxys.push(proxy.join('\t'));
      proxy = null;
    })
    console.log(proxys);
    return proxys;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *  @description 输入proxy，存储proxy
 *  @param {String} proxy
 *  @returns {String} proxy
 *
 */
const detectProxy = async (proxy = '') => {
  try {
    let uri = `http://ip.chinaz.com/getip.aspx`;
    let options = {
      uri,
      method: 'GET',
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
      },
      timeout: 1000 * 10,
      proxy
    }
    let data = await rp(options);
    console.log(data);
    data = data.replace('ip', '"ip"').replace('address', '"address"').replace(/'/g, '"');
    console.log(data);
    let {ip, address} = JSON.parse(data);
    console.log(`[proxy] detect ip <${ip}>`);
    console.log(`[proxy] detect address <${address}>`);
    return proxy;
  } catch (error) {
    console.error(`[error] detect proxy <${proxy}>`);
    console.error(error);
    return '';
  }
}

if (module.parent === null) {
  detectProxy('http://101.4.136.34:80');
}

export default detectProxy;
