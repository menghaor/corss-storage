# localStorage跨域存储解决方案

在日常需求中： 有两个不同的域名（http://localhost:8080 和 http://localhost:8082）想共用本地存储中的同一个 token 作为统一登录凭证：


### 什么是跨域？
protocol（协议）、host（域名）、port（端口）有一个地方不同都会产生跨域现象，也被称为客户端同源策略
本地存储受同源策略限制
客户端（浏览器）出于安全性考虑，无论是 localStorage 还是 sessionStorage 都会受到同源策略限制。

#### 那么如何实现跨域存储呢？
```javascript
	otherWindow.postMessage('message', targetOrigin, [transfer])
```



### 使用步骤：
1. 使用tomcat三个服务，分别为：8080（client1.html）， 8081(cross-middle.html)， 8082(client2.html);
2. client1 和 client2 的数据共享使用；



### 备注
日常可以把 corss-middle.html/js 单独放在一个端口，专门做跨域存储中间件使用；





