const Router = require('koa-router');
const router = new Router();
const callCloudDB = require('../utils/callCloudDB.js')
const callCloudStorage = require('../utils/callCloudStorage.js')

router.get('/list', async (ctx, next)=>{
  //最多只能获取十条
  const query = `db.collection(\"swiperlist\").get()`
  const res = await callCloudDB(ctx,'databasequery',query)
  //数据库数据，是json格式
  // console.log(res.data)
  //获取文件下载链接。因为数据库的链接不能直接访问
  let file_list = [];
  for(let i=0,len=res.data.length;i<len;i++){
    const item = {
      fileid:JSON.parse(res.data[i]).file_id,
      max_age:7200
    }
    file_list.push(item)
  }
  const res2 = await callCloudStorage.download(ctx,file_list)
  let returnData = [];
  for(let i=0,len=res2.file_list.length;i<len;i++){
    returnData.push({
      fileid:res2.file_list[i].fileid,
      img_url:res2.file_list[i].download_url,
      _id:JSON.parse(res.data[i])._id
    })
  }
  ctx.body = {
    data:returnData,
    code:200
  };

})
router.post('/upload',async (ctx,next)=>{
  let fileid = await callCloudStorage.upload(ctx)
  //获取file_id属性，向云数据库添加一条记录
  const query = `db.collection(\"swiperlist\").add({
    data:[
      {
        file_id: "${fileid}"
      }
    ]
  })`
  const res = await callCloudDB(ctx,'databaseadd',query)
  ctx.body = {
    code: 200,
    id_list: res.id_list
  }
})
router.get('/deleteSwiper',async (ctx,next)=>{
  const query = `db.collection(\"swiperlist\").doc('${ctx.request.query.id}').remove()`
  const res = await callCloudDB(ctx,'databasedelete',query)
  ctx.body = {
    code:200,
    delete_list:res.deleted
  }
})
module.exports = router;