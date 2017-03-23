const rp = require('request-promise');

const testProxy = async () => {
    try {
        let uri = `http://ip.chinaz.com/getip.aspx`;
        let opts = {
            method: 'get',
            uri,
            host: 'http://115.192.61.75',
            port: 8118
        }
        let data = await rp(opts);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

testProxy();