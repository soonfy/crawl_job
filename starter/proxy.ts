import * as cheerio from 'cheerio';
import * as rp from 'request-promise';
import * as superagent from 'superagent';
import * as sp from 'superagent-proxy';
import * as fs from 'fs';

sp(superagent);

/**
 *
 *  @description 输入proxy网站采集页数，输出proxy列表
 *  @param {Number} pn
 *  @returns {Array} proxys
 *
 */
const getProxy = async (pn = 1) => {
  try {
    let uri = `https://cnodejs.org/topic/50d41da5637ffa4155f63179`;
    uri = `http://www.xicidaili.com/nn/${pn}`;

    let options = {
      host: `221.216.194.177`,
      port: 808,
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
 *  @description 输入proxy保存路径，proxy网站采集页数，存储proxy
 *  @param {String} file
 *  @param {Number} count
 *  @returns {Array} usefulProxys
 *
 */
const testProxy = async (file = './header/proxy.txt', count = 100) => {
  try {
    let uri = `http://ip.chinaz.com/getip.aspx`;
    let pn = 1, usefulProxys: Array<string> = [];
    while (pn <= count) {
      console.log(`test page ${pn}`);
      let proxys = await getProxy(pn);
      ++pn;
      console.log(proxys.length);
      for (let _proxy of proxys) {
        let proxy = `http://${_proxy.split('\t')[0]}:${_proxy.split('\t')[1]}`;
        console.log(proxy);
        try {
          let ip = await superagent.get(uri).proxy(proxy).timeout(3000);
          if (ip.statusCode === 200) {
            console.log(ip.text);
            let str = _proxy + '\t' + ip.text + '\r\n'
            fs.appendFileSync(file, str);
            usefulProxys.push(str);
          } else {
            console.error(`status code !== 200`);
            console.error(ip);
          }
        } catch (error) {
          console.error(`test error...`);
          console.error(error);
        }
      }
    }
    console.log(`all proxys test over...`);
    return usefulProxys;
  } catch (error) {
    console.error(error);
  }
}

if (module.parent === null) {
  testProxy();
}

export default testProxy;