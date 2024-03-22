const getAccessToken = require('./getAccessToken');
const axios = require('axios');
const callCloudDB = async (ctx,fnName,query={}) => {
  const access_token = await getAccessToken();
  const options = {
    method:'post',
    url:`https://api.weixin.qq.com/tcb/${fnName}?access_token=${access_token}`,
    data:{
      query,
      env:ctx.state.env
    },
    json:true
  }
  return await axios(options).then((res)=>{
    return res.data;
  }).catch((err)=>{
    return err;
  })
}
module.exports = callCloudDB;