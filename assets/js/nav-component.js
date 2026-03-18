// 通用导航搜索组件
class NavSearchComponent extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <nav class="main-nav">
                <div class="nav-brand">
                    <a href="/index.html">金鹰三创赛</a>
                </div>
                <div class="nav-search">
                    <input type="text" id="navSearchInput" placeholder="搜索..." autocomplete="off">
                    <button onclick="navSearch()" title="搜索">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </button>
                </div>
                <ul class="nav-menu">
                    <li><a href="/index.html">首页</a></li>
                    <li><a href="/pages/about.html">关于</a></li>
                    <li><a href="/pages/contact.html">联系</a></li>
                </ul>
            </nav>
            <style>
                .main-nav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 50px;
                    background: #fff;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                .nav-brand a {
                    font-size: 20px;
                    font-weight: bold;
                    color: #333;
                    text-decoration: none;
                }
                .nav-search {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .nav-search input {
                    padding: 8px 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 20px;
                    width: 200px;
                    outline: none;
                    transition: all 0.3s;
                }
                .nav-search input:focus {
                    border-color: #4285f4;
                    width: 250px;
                }
                .nav-search button {
                    background: #4285f4;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .nav-search button:hover {
                    background: #3367d6;
                }
                .nav-menu {
                    display: flex;
                    list-style: none;
                    gap: 30px;
                    margin: 0;
                    padding: 0;
                }
                .nav-menu a {
                    text-decoration: none;
                    color: #666;
                    font-weight: 500;
                }
                .nav-menu a:hover {
                    color: #4285f4;
                }
                @media (max-width: 768px) {
                    .main-nav {
                        padding: 15px 20px;
                        flex-wrap: wrap;
                    }
                    .nav-search input {
                        width: 150px;
                    }
                    .nav-menu {
                        display: none; /* 移动端可改为汉堡菜单 */
                    }
                }
            </style>
        `;
    }
}

customElements.define('nav-search', NavSearchComponent);

// 搜索功能
function navSearch() {
    const input = document.getElementById('navSearchInput');
    const keyword = input.value.trim();
    if (keyword) {
        // 使用百度搜索，限定在你的项目相关内容（可选）
        const url = `https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`;
        window.open(url, '_blank');
        input.value = ''; // 清空输入框
    }
}

// 回车键触发搜索
document.addEventListener('keypress', function(e) {
    if (e.target.id === 'navSearchInput' && e.key === 'Enter') {
        navSearch();
    }
});