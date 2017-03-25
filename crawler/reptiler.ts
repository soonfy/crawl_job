/**
 *  reptile
 */
import * as url from 'url';

import * as rp from 'request-promise';
import * as cheerio from 'cheerio';

import * as Component from './component';

const {getUA, getCookie, getHeaders, getProxy, deleteProxy} = Component.default;

const getReptiler = async (uri, proxy = false, opts = {}) => {
  try {
    let _proxy = null;
    uri = uri.startsWith('http') ? uri : `http://${uri}`;
    console.log(`[getreptiler] get reptile <${uri}> ...`);
    if (!global.headersf) {
      let {protocol, host} = url.parse(uri);
      let prohost = [protocol, host].join('//');
      await getHeaders(prohost);
    }
    if (proxy) {
      _proxy = await getProxy();
      if (!_proxy) {
        return console.log(`[getReptiler] db no proxy, wait detect and store proxy...`);
      }
    }
    let options = {
      method: 'GET',
      uri,
      headers: headersf,
      proxy: _proxy
    }
    console.log(options);
    let data = await rp(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(`[error] get reptiler <${uri}> error...`);
    console.error(error);
    if (global.proxysf) {
      await deleteProxy(proxysf);
      global.headersf = null;
    }
    return await getReptiler(uri, proxy, opts);
  }
}

const postReptiler = async (uri, form, proxy = false, opts = {}) => {
  try {
    let _proxy = null;
    uri = uri.startsWith('http') ? uri : `http://${uri}`;
    console.log(`[postReptiler] post reptile <${uri}> ...`);
    if (!global.headersf) {
      let {protocol, host} = url.parse(uri);
      let prohost = [protocol, host].join('//');
      await getHeaders(prohost);
    }
    if (proxy) {
      _proxy = await getProxy();
      if (!_proxy) {
        return console.log(`[postreptiler] db no proxy, wait detect and store proxy...`);
      }
    }
    let options = {
      method: 'POST',
      uri,
      form,
      headers: headersf,
      proxy: _proxy
    }
    console.log(options);
    let data = await rp(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(`[error] post reptiler <${uri}> error...`);
    console.error(error);
    if (global.proxysf) {
      await deleteProxy(proxysf);
      global.headersf = null;
    }
    return await postReptiler(uri, form, proxy, opts);
  }
}

// postReptiler('https://www.lagou.com/jobs/positionAjax.json?city=北京&needAddtionalResult=false', { first: true, pn: 1, kd: '自然语言处理' }, true);

// getReptiler('http://ip.chinaz.com/getip.aspx', true)

export default {
  getReptiler,
  postReptiler
}
