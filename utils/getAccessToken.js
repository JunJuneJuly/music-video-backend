const APPID = 'wx1e3142ff6a23840a';
const APPSECRET = '45fef201f19b1281a20c7593db9bbb40';
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'access_token.json');

const updateAccessToken = async () => {
  const response = await axios.get(URL);
  if(response.data.access_token){
    //写入文件
    fs.writeFileSync(filePath, JSON.stringify({
      access_token: response.data.access_token,
      createTime: new Date()
    }));
  }else{
    await updateAccessToken();
  }
}
//读取文件
const getAccessToken = async() => {
  try{
    const content = fs.readFileSync(filePath, 'utf8');
    //防止服务器宕机，存储的token不是最新的
    const readObj = JSON.parse(content);
    const createTime = new Date(readObj.createTime).getTime();
    const nowTime = new Date().getTime();
    if((nowTime - createTime) > 720000){
      await updateAccessToken();
      await getAccessToken();
    }
    return readObj.access_token;
  }catch(err){
    await updateAccessToken();
    await getAccessToken();
  }
}
//authorizer_access_token 有效期为 2 小时
setInterval(()=>{
  updateAccessToken();
},(720000-30000))

module.exports = getAccessToken;
