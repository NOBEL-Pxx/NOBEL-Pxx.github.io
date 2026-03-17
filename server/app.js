// server/app.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const url = require('url');

const app = express();
const PORT = 3001;

// ================= 配置区 =================

// 1. AI 配置 (阿里云 DashScope)
// ⚠️ 注意：生产环境建议将 Key 放在 .env 文件中，不要直接提交到代码库
const AI_API_KEY = "sk-cced2abb83df4806965ab9647a4f80f2"; 
const AI_API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

// 2. 天气配置 (高德地图)
// ⚠️ 请确保这里填入的是你刚才申请的 "Web 服务" 类型的 Key
const GAODE_KEY = "1ded09e9a5348e26d03bca007b6acb3c"; // <--- 记得替换这里！

// ================= 中间件 =================

app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 请求体

// ================= 路由逻辑 =================

/**
 * 接口 1: AI 对话 (/api/chat)
 * 方法: POST
 * 逻辑: 转发请求给阿里云 DashScope (Qwen-Turbo)
 */
app.post('/api/chat', async (req, res) => {
    console.log(`🤖 [${new Date().toLocaleTimeString()}] 收到 AI 请求`);
    
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, reply: "请输入内容" });
        }

        const response = await axios.post(
            AI_API_URL,
            {
                model: "qwen-turbo",
                input: {
                    messages: [
                        { role: "system", content: "你是一个 helpful 的助手，专注于介绍兰州大学金鹰数字乡村项目。" },
                        { role: "user", content: message }
                    ]
                },
                parameters: {
                    temperature: 0.7
                }
            },
            {
                headers: {
                    "Authorization": `Bearer ${AI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // 兼容不同版本的返回结构
        const reply = response.data?.output?.text || response.data?.choices?.[0]?.message?.content || "AI 未返回有效内容";
        
        console.log(`✅ AI 回复成功`);
        res.json({ success: true, reply });

    } catch (err) {
        console.error("❌ 调用千问失败：", err.response?.data || err.message);
        
        let errorMsg = "AI暂时无法回答，请稍后再试";
        if (err.response?.status === 401) {
            errorMsg = "API Key 无效，请联系管理员检查后端配置。";
        } else if (err.code === 'ENOTFOUND') {
            errorMsg = "网络连接错误，无法访问 AI 服务。";
        }

        res.json({
            success: false,
            reply: errorMsg
        });
    }
});

/**
 * 接口 2: 天气查询 (/api/weather)
 * 方法: GET
 * 逻辑: 代理请求给高德地图 API
 */
app.get('/api/weather', (req, res) => {
    console.log(`🌤️ [${new Date().toLocaleTimeString()}] 收到天气请求`);

    const cityCode = req.query.city || '620123'; // 默认榆中县
    
    if (!GAODE_KEY || GAODE_KEY.includes("你的新_Key")) {
        return res.status(500).json({ 
            status: '0', 
            info: '后端配置错误：请在 app.js 中填写有效的 GAODE_KEY' 
        });
    }

    const gaodeUrl = `https://restapi.amap.com/v3/weather/weatherInfo?key=${GAODE_KEY}&city=${cityCode}&extensions=base`;

    https.get(gaodeUrl, (response) => {
        let data = '';
        
        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                // 直接透传高德的返回结果给前端
                res.status(response.statusCode).json(jsonData);
            } catch (e) {
                console.error('解析高德数据失败:', e);
                res.status(500).json({ error: '数据解析失败', detail: e.message });
            }
        });
    }).on('error', (err) => {
        console.error('请求高德服务器失败:', err.message);
        res.status(500).json({ error: '无法连接高德服务器', message: err.message });
    });
});

// ================= 启动服务 =================

app.listen(PORT, () => {
    console.log('------------------------------------------------');
    console.log(`🚀 综合后端服务已启动 (AI + 天气)`);
    console.log(`   监听端口: ${PORT}`);
    console.log(`   文件路径: ${__filename}`);
    console.log(`   AI 接口：http://localhost:${PORT}/api/chat (POST)`);
    console.log(`   天气接口: http://localhost:${PORT}/api/weather (GET)`);
    console.log('------------------------------------------------');
    console.log('💡 提示：请保持此窗口开启，不要关闭！');
});