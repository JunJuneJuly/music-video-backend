const getAccessToken = require('./getAccessToken');
const axios = require('axios');

const callCloudFunction = async (ctx,fnName,params) => {
  const access_token = await getAccessToken();
  const options = {
    method:'post',
    url:`https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ctx.state.env}&name=${fnName}`,
    data:{
      ...params
    }
  }
  return await axios(options).then((res)=>{
    return res.data;
  }).catch((err)=>{
    return err;
  })
}
module.exports = callCloudFunction;