/**
 *  crawler component
 */

import * as fs from 'fs';
import * as os from 'os';

import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

require('../app/models/index');

const getUA = (file = './header/ua.txt', opts = {}) => {
  try {
    console.log(`[getua] get ua from <${file}> ...`);
    let data = fs.readFileSync(file, 'utf-8');
    let uas = data.split(os.EOL);
    console.log(uas);
    return uas;
  } catch (error) {
    console.error(`[error] get ua from <${file}> error...`);
    console.error(error);
    getUA(file);
  }
}
const uas = getUA();

const getCookie = async (uri, opts = {}) => {
  try {
    uri = uri.startsWith('http') ? uri : `http://${uri}`;
    let len = uas.length,
      ua = uas[Math.floor(Math.random() * len)] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36';
    console.log(`[cookie] ua <${ua}> ...`);
    console.log(`[cookie] get cookie from <${uri}> ...`);
    let options = {
      method: 'GET',
      uri: uri,
      headers: {
        'User-Agent': ua
      },
      timeout: 1000 * 30,
      resolveWithFullResponse: true
    }
    let response = await rp(options);
    let cookie: string = response.headers['set-cookie'];
    console.log(`[cookie] <${uri}> <${cookie}> ...`);
    let headers = global.headersf = {
      'User-Agent': ua,
      'Cookie': cookie,
      'timeout': 1000 * 30
    };
    return headers;
  } catch (error) {
    console.error(`[error] get cookie from <${uri}> error...`);
    console.error(error);
    return await getCookie(uri);
  }
}

const getHeaders = async (uri, flush = false, opts = {}) => {
  console.log(`[headers] get headers from <${uri}> <${flush}> ...`);
  if (!global.headersf || flush) {
    uri = uri.startsWith('http') ? uri : `http://${uri}`;
    console.log(`[headers] flush <${uri}> cookie...`);
    uri ? (await getCookie(uri)) : console.error(`[error] pass param uri...`)
  }
  let headers = headersf;
  return headers;
};

const proxyParser = async (page) => {
  try {
    let uri = `http://www.xicidaili.com/nn/${page}`;
    console.log(`[proxy] get proxy from <${uri}> ...`);
    let headers = await getHeaders(uri);
    let options = {
      method: 'GET',
      uri,
      headers,
      timeout: 1000 * 30
    }
    let body = await rp(options);
    let $ = cheerio.load(body);
    let proxys: Array<string> = [];
    $('tr.odd').map((_index, _item) => {
      let proxy = [];
      proxy.push($(_item).children('td').eq(1).text().trim());
      proxy.push($(_item).children('td').eq(2).text().trim());
      proxys.push(proxy.join(':'));
      proxy = [];
      proxy.push($(_item).next('tr').children('td').eq(1).text().trim());
      proxy.push($(_item).next('tr').children('td').eq(2).text().trim());
      proxys.push(proxy.join(':'));
      proxy = null;
    })
    console.log(proxys);
    return proxys;
  } catch (error) {
    console.error(`[error] proxy parse page <${page}> error...`);
    console.error(error);
    return await proxyParser(page);
  }
}

const storeProxy = async (proxys) => {
  try {
    let promises = proxys.map(async proxy => {
      let doc = {
        proxy,
        status: 0,
        create: new Date()
      }
      Proxy.uniSave(doc, async (err, _proxy) => {
        if (err) {
          return console.error(err);
        }
        console.log(_proxy);
      })
    })
    await Promise.all(promises);
  } catch (error) {
    console.error(`[error] store proxys error...`);
    console.error(error);
  }
}

const detectProxy = async (max = 20) => {
  try {
    let page = 0, results = [];
    while (page < max) {
      ++page;
      let proxys = await proxyParser(page);
      let uri = `http://ip.chinaz.com/getip.aspx`;
      let temps = [];
      for (let proxy of proxys) {
        try {
          proxy = proxy.startsWith('http') ? proxy : `http://${proxy}`;
          console.log(`[detectproxy] detect <${proxy}> from <${uri}> ...`);
          let options = {
            method: 'GET',
            uri,
            proxy,
            timeout: 1000 * 3
          }
          let body = await rp(options);
          body = body.replace('ip', '\'ip\'').replace('address', '\'address\'');
          body = '"' + body;
          body += '"';
          let data = JSON.parse(body);
          console.log(data);
          temps.push(proxy);
          await storeProxy([proxy]);
        } catch (error) {
          console.error(`[error] <${proxy}> error...`);
          console.error(error);
        }
      }
      proxys = temps;
      temps = null;
      proxys = proxys.filter(x => x);
      console.log(proxys);
      results = results.concat(proxys);
    }
    return results;
  } catch (error) {
    console.error(`[error] detect proxys error...`);
    console.error(error);
    return await detectProxy(max);
  }
}

const getProxy = async (opts = {}) => {
  try {
    let _proxy = await Proxy.findOne({ status: 0 });
    if (!_proxy) {
      console.log(`[getproxy] db no proxy, start detect and store proxy...`);
      await detectProxy();
    }
    let proxy = global.proxysf = _proxy.proxy;
    console.log(`[getproxy] get <${proxy}> from db...`);
    return proxy;
  } catch (error) {
    console.error(`[getproxy] get proxy from db error`);
    console.error(error);
    return await getProxy(opts);
  }
}

const deleteProxy = async (proxy, opts = {}) => {
  try {
    let _proxy = await Proxy.update({ proxy: proxy }, { $set: { status: -1 } }, { multi: true, new: true });
    console.log(`[deleteproxy] delete proxy <${proxy}>`);
    console.log(_proxy);
  } catch (error) {
    console.error(`[deleteproxy] delete proxy <${proxy}> error...`);
    console.error(error);
  }
}

if (!module.parent) {
  detectProxy();
}

export default { getUA, getCookie, getHeaders, getProxy, deleteProxy };

// getCookie(`www.segmentfault.com/q/1010000008822852`);
// getHeaders(`www.segmentfault.com/q/1010000008822852`);
// detectProxy(1);
