import os
import re

def global_fix():
    root_dir = r"d:\恩哥YT\home_repair"
    service_dir = os.path.join(root_dir, "service")
    
    # 資源路徑對照表 (假設都在 assets/images/ 下)
    # 將 favicon.ico -> favicon.svg, logo.png -> logo.svg
    
    def process_file(filepath, is_sub):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 1. 修正 Favicon 與 Logo 檔案名
        content = content.replace('favicon.ico', 'favicon.svg')
        content = content.replace('logo.png', 'logo.svg')
        
        # 2. 修正子目錄路徑屬性
        if is_sub:
            # 修正資源路徑 (favicon, logo, css, js)
            # 如果發現 "assets/" 開頭且前面沒有 ../，則補上 ../
            content = re.sub(r'(href|src)="(?!\.\./|http|https|tel:|mailto:|#|/)(assets/.*?)"', r'\1="../\2"', content)
            
            # 修正導覽路徑 (index, cases, about, faq, process)
            root_pages = ['index.html', 'cases.html', 'about.html', 'process.html', 'faq.html']
            for page in root_pages:
                content = re.sub(r'href="(?!\.\./)' + re.escape(page) + r'(#.*?)?"', r'href="../' + page + r'\1"', content)
            
            # 修正內部的 service/ 誤植 (例如在 service/ 下連結 service/tiling.html)
            content = content.replace('href="service/', 'href="')
        else:
            # 根目錄頁面確保資源路徑是 assets/
            # 確保連結到 service/ 的是正確的 service/filename.html
            pass

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {os.path.relpath(filepath, root_dir)}")

    # 處理根目錄 HTML
    for f in os.listdir(root_dir):
        if f.endswith('.html'):
            process_file(os.path.join(root_dir, f), False)
            
    # 處理 service 目錄 HTML
    if os.path.exists(service_dir):
        for f in os.listdir(service_dir):
            if f.endswith('.html'):
                process_file(os.path.join(service_dir, f), True)

if __name__ == "__main__":
    global_fix()
