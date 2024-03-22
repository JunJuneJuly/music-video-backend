const Router = require('koa-router');
const router = new Router();
const callCloudDB = require('../utils/callCloudDB.js')

router.get('/list',async (ctx, next)=>{
  const query = `db.collection(\"blog\")
  .skip(${ctx.request.query.start})
  .limit(${ctx.request.query.count})
  .orderBy('createTime', 'desc')
  .get()`
  const res = await callCloudDB(ctx, 'databasequery', query)
  ctx.body = {
    code:200,
    data:res.data
  }
})
router.get('/deleteBlogItem',async (ctx,next)=>{
  const query = `db.collection(\"blog\").doc('${ctx.request.query.id}').remove()`
  const res = await callCloudDB(ctx,'databasedelete',query)
  ctx.body = {
    code:200,
    delete_list:res.deleted
  }
})
module.exports = router;