// 自动计算正确路径并加载导航组件
(function() {
    // 获取当前页面深度
    const path = window.location.pathname;
    const depth = path.split('/').filter(p => p.length > 0 && !p.endsWith('.html')).length;
    
    // 计算回退路径
    let prefix = '';
    for (let i = 0; i < depth; i++) {
        prefix += '../';
    }
    if (prefix === '') prefix = './';
    
    // 动态加载导航组件脚本
    const script = document.createElement('script');
    script.src = prefix + 'assets/js/nav-component.js';
    document.head.appendChild(script);
    
    // 页面加载完成后插入导航
    window.addEventListener('load', function() {
        const nav = document.createElement('nav-search');
        document.body.insertBefore(nav, document.body.firstChild);
    });
})();