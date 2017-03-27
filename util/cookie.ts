import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import * as os from 'os';
import * as fs from 'fs';

/**
 *
 *  @description 输入链接地址，输出cookie
 *  @param {String} uri
 *  @returns {String} cookie
 *
 */
const getCookie = async (uri: String = 'https://www.douban.com/') => {
  try {
    console.log(`[cookie] get cookie from <${uri}>`);
    let options = {
      uri,
      method: 'GET',
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
      },
      timeout: 1000 * 10,
      resolveWithFullResponse: true
    }
    let response = await rp(options);
    let cookie: string = response.headers['set-cookie'];
    console.log(`[cookie] get cookie <${cookie}>`);
    return cookie;
  } catch (error) {
    console.error(`[error] get cookie from <${uri}>`);
    console.error(error);
    return await getCookie(uri);
  }
}

if (module.parent === null) {
  getCookie();
}

export default getCookie
