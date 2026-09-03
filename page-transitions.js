// =========================================================================
// 页面平滑无缝转场引擎 (Smooth Cross-Page Transition Engine)
// 提供苹果/保时捷级别的优雅页面出入场平滑淡入淡出与视口微动效
// =========================================================================
(function() {
    // 1. 注入转场动效基础样式
    const style = document.createElement('style');
    style.id = 'page-transition-style';
    style.textContent = `
        @keyframes pageFadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        body {
            animation: pageFadeIn 0.36s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        body.page-leaving {
            opacity: 0 !important;
            transform: translateY(-8px) scale(0.995) !important;
            transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1) !important;
            pointer-events: none !important;
        }
        @view-transition {
            navigation: auto;
        }
    `;
    if (document.head) {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
    }

    // 2. 拦截全站页面链接跳转，提供顺滑出场动画
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || anchor.target === '_blank') return;

        // 仅拦截本站本地 HTML 页面跳转
        if (href.endsWith('.html') || href === 'index.html' || href === 'tools.html') {
            e.preventDefault();
            document.body.classList.add('page-leaving');
            setTimeout(() => {
                window.location.href = href;
            }, 190);
        }
    });

    // 3. 兼容浏览器前进/后退缓存 (bfcache)，防止返回后页面残留透明度
    window.addEventListener('pageshow', (event) => {
        document.body.classList.remove('page-leaving');
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    });
})();
