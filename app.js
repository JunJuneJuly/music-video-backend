const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const cors = require('koa2-cors');
const router = new Router();
const ENV = 'music-test-8ge8xbue8c443d40';
const {koaBody} = require('koa-body');
//注意，必须放在前面
app.use(async (ctx,next) => {
  ctx.state.env = ENV;
  await next();//执行下一个中间件
});

//跨域
app.use(cors({
  origin:['http://localhost:81'],//允许跨域访问的地址
  credentials:true,//是否允许发送cookie
}));
//接收post参数解析
app.use(koaBody({
  multipart:true,//支持文件上传
}));
const playlist = require('./controller/playlist');
const swiperlist = require('./controller/swiper');
const blog = require('./controller/blog');
router.use('/playlist',playlist.routes());
router.use('/swiperlist',swiperlist.routes());
router.use('/blog',blog.routes());
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000,()=>{
  console.log("server is running at http://localhost:3000");
});