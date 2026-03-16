/* assets/js/main.js */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 滚动动画观察器
    const observerOptions = {
        threshold: 0.1, // 元素出现 10% 时触发
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // 可选：动画只播放一次，取消观察
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => {
        observer.observe(el);
    });

    // 2. 移动端简单的导航提示 (如果屏幕太窄)
    if (window.innerWidth < 768) {
        const nav = document.querySelector('nav');
        if(nav) {
            // 在移动端，我们可以选择一个策略：
            // 策略 A: 隐藏导航，只显示 Logo 和返回键 (当前 global.css 已实现)
            // 策略 B: 添加一个点击显示菜单的按钮 (此处略，保持简洁)
            console.log("Mobile view detected: Navigation simplified.");
        }
    }

    // 3. 给所有外部链接添加安全属性
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    console.log("夏官营数字乡村展示系统已加载完毕 🚀");
});