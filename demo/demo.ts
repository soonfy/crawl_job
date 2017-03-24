const rp = require('request-promise');
const superagent = require('superagent');
const sp = require('superagent-proxy');
sp(superagent);

const testProxy = async () => {
  try {
    let uri = `http://ip.chinaz.com/getip.aspx`;
    let opts = {
      method: 'get',
      uri,
      proxy: 'http://124.88.67.24:80'
    }
    let data = await rp(opts);
    console.log(data);
    let response = await superagent.get(uri).proxy(`${opts.proxy}`).timeout(30000);
    console.log(response.text);
  } catch (error) {
    console.error(error);
  }
}

testProxy();