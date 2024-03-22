const getAccessToken = require('./getAccessToken');
const axios = require('axios');
const fs = require('fs');
const callCloudStorage = {
  async download (ctx,file_list) {
    const access_token = await getAccessToken();
    const options = {
      method:'post',
      url:`https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${access_token}`,
      data:{
        file_list,
        env:ctx.state.env
      },
      json:true
    }
    return await axios(options).then((res)=>{
      return res.data;
    }).catch((err)=>{
      return err;
    })
  },
  async upload(ctx){
    const access_token = await getAccessToken();
    const file = ctx.request.files.file;
    const path = `swiper/${Date.now()}-${Math.random()}-${file.originalFilename}`
    const options = {
      method:'post',
      url:`https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`,
      data:{
        path,
        env:ctx.state.env
      }
    }
    const res = await axios(options);
    let {url,authorization,cos_file_id,token}= res.data
    const params = {
      method:'post',
      headers:{
        'content-type':'multipart/form-data',
      },
      url,
      data:{
        key:path,
        Signature:authorization,
        'x-cos-security-token':token,
        'x-cos-meta-fileid':cos_file_id,
        file:fs.createReadStream(file.filepath)
      }
    }
    const res2 = await axios(params);
    return res.data.file_id
  }
}
module.exports = callCloudStorage;