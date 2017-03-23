import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import * as os from 'os';
import * as fs from 'fs';

/**
 *
 *  @description 输入cookie保存路径，存储cookie
 *  @param {String} file
 *  @returns {String} cookie
 *
 */
const crawlCookie = async (file = `./header/cookie.txt`) => {
  try {
    let uri = `http://www.lagou.com`;
    console.log(`crawl cookie from ${uri}`);
    let options = {
      uri,
      method: 'get',
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
      },
      resolveWithFullResponse: true
    }
    let response = await rp(options);
    console.log(response.headers);
    let cookie: string = response.headers['set-cookie'];
    console.log(cookie);
    fs.appendFileSync(file, cookie + '\r\n');
    console.log(`ua write to ${file}`);
    return cookie;
  } catch (error) {
    console.error(error);
  }
}

if (module.parent === null) {
  crawlCookie();
}

export default crawlCookie