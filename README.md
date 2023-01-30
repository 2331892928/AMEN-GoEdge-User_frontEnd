# 基于Vue-Quasar-Manage项目制作的AMEN-GoEdge-User的前端项目，用于管理AMEN-GoEdge-User用户后台
# 由于GoEdge需要商业版才能用用户端，特此自己制作了用户端，现有功能：
> 1.注册  
> 2.登录  
> 3.验证码  
> 4.网站管理  
> 5.添加/删除网站  
> 6.https设置(http2/强制https/https证书/hsts/开关http|s/ocps/tls)  
> 7.源站管理(支持端口/支持域名/支持ip/支持https/支持https证书/添加/删除)  
> 8.证书管理(一键绑定/添加/删除)  
# npm版本
> 12.22.12
# 如何安装
> 然后npm install 进行安装依赖
> 然后npm run build 进行打包
> 目录下dist文件夹就是站点文件夹
> 通过静态网站托管需要注意：npm版本，反向代理需要将后端代理，代理格式为;来自：/api/*或/api 到：后端host 状态码：200