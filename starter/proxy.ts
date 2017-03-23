import * as cheerio from 'cheerio';
import * as rp from 'request-promise';
import * as superagent from 'superagent';
import * as sp from 'superagent-proxy';
import * as fs from 'fs';

// const rp = require('request-promise');
// const cheerio = require('cheerio');
// const request = require('superagent');
// require('superagent-proxy')(request);
// const fs = require('fs');

sp(superagent);

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
    let proxys = [];
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

const testProxy = async (file = './header/proxy.txt', count = 100) => {
  try {
    let uri = `http://ip.chinaz.com/getip.aspx`;
    let pn = 1;
    while (pn <= count) {
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
            fs.appendFileSync(file, _proxy + '\t' + ip.text + '\r\n');
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
  } catch (error) {
    console.error(error);
  }
}

testProxy();