import * as rp from 'request-promise';
import * as cheerio from 'cheerio';
import * as os from 'os';
import * as fs from 'fs';

/**
 *
 *  @description 输入ua保存路径，保存ua
 *  @param {String} file
 *  @returns {String} ua
 *
 */
const getUA = async (file = `./logs/ua.txt`) => {
  try {
    let uri = `http://www.useragentstring.com/pages/useragentstring.php?name=All`;
    console.log(`[ua] get ua from <${uri}>`);
    let options = {
      uri,
      method: 'GET',
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        "Host": "www.useragentstring.com",
        "Referer": "http://www.useragentstring.com/pages/useragentstring.php",
      },
      transform: (body) => cheerio.load(body)
    }
    let $ = await rp(options);
    let uas = $('#liste li').map((_index, item) => $(item).text().trim());
    uas = Array.prototype.slice.call(uas);
    console.log(uas);
    let ua: string = uas.join(os.EOL);
    fs.writeFileSync(file, ua);
    console.log(`[ua] ua write to <${file}>`);
    return ua;
  } catch (error) {
    console.error(`[error] get ua error.`);
    console.error(error);
    return await getUA(file);
  }
}

if (module.parent === null) {
  getUA();
}

export default getUA;
