// server/weather.js
const http = require('http');
const url = require('url');
const https = require('https');

// ⚠️ 配置：你的高德地图 API Key
const GAODE_KEY = '1ded09e9a5348e26d03bca007b6acb3c';
const PORT = 3001; // 后端服务端口

const server = http.createServer((req, res) => {
    // 设置 CORS 头，允许前端跨域访问（包括 file:// 协议和 localhost）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // 处理预检请求 (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 解析请求 URL
    const parsedUrl = url.parse(req.url, true);
    
    // 只处理 /api/weather 路径的 GET 请求
    if (req.method === 'GET' && parsedUrl.pathname === '/api/weather') {
        const cityCode = parsedUrl.query.city || '620123'; // 默认榆中县

        console.log(`🌤️ [${new Date().toLocaleTimeString()}] 收到天气请求，城市代码: ${cityCode}`);

        // 构建请求高德的 URL
        const gaodeUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=${GAODE_KEY}&city=${cityCode}&extensions=base`;

        // 发起请求到高德服务器
        https.get(gaodeUrl, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                    if (jsonData.status === '1') {
                        console.log('✅ 高德返回成功');
                    } else {
                        console.warn('⚠️ 高德返回异常:', jsonData.info);
                    }
                    
                    // 将高德的数据原样返回给前端
                    res.writeHead(response.statusCode);
                    res.end(data);
                } catch (e) {
                    console.error('❌ 解析高德返回数据失败:', e);
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: '数据解析失败', detail: e.message }));
                }
            });
        }).on('error', (err) => {
            console.error('❌ 请求高德服务器失败:', err.message);
            res.writeHead(500);
            res.end(JSON.stringify({ error: '无法连接高德服务器', message: err.message }));
        });

    } else {
        // 其他路径返回 404
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found', path: parsedUrl.pathname }));
    }
});

server.listen(PORT, () => {
    console.log('------------------------------------------------');
    console.log(`🚀 天气代理服务已启动`);
    console.log(`   监听端口: ${PORT}`);
    console.log(`   文件路径: ${__filename}`);
    console.log(`   测试地址: http://localhost:${PORT}/api/weather?city=620123`);
    console.log('------------------------------------------------');
    console.log('💡 提示：请保持此窗口开启，不要关闭！');
});