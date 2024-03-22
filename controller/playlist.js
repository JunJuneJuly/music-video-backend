const Router = require('koa-router');
const router = new Router();
const callCloudFunction = require('../utils/callCloudFn.js')
const callCloudDB = require('../utils/callCloudDB.js')

router.get('/list',async (ctx, next)=>{
    // 触发云函数
    const query = ctx.request.query;
    const res = await callCloudFunction(ctx,'music',{
        $url:'playlist',
        start:parseInt(query.start),
        count:parseInt(query.count)
    })
    let data = []
    if(res.resp_data){
        data = JSON.parse(res.resp_data).data
    }
    ctx.body = {
        data,
        code:200
    }
})
//查询歌单详情
router.get('/getById',async (ctx, next)=>{
    const query = `db.collection(\"playlist\").doc('${ctx.request.query.id}').get()`
    const res = await callCloudDB(ctx,'databasequery',query)
    ctx.body = {
        data:res.data,
        code:200
    }
})
//更新歌单详情
router.post('/updatePlaylist',async (ctx, next)=>{
    const query = `db.collection(\"playlist\").doc('${ctx.request.body._id}').update({
        data:{
            name:'${ctx.request.body.name}',
            copywriter:'${ctx.request.body.copywriter}',
        }
    })`
    const res = await callCloudDB(ctx,'databaseupdate',query)
    ctx.body = {
        data:res.data,
        code:200
    }

})
//删除歌单
router.get('/deleteById',async (ctx, next)=>{
    const query = `db.collection(\"playlist\").doc('${ctx.request.query.id}').remove()`
    const res = await callCloudDB(ctx,'databasedelete',query)
    ctx.body = {
        data:res.data,
        code:200
    }
})

module.exports = router;