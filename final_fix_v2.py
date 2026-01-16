import os
import re

def global_fix():
    # 使用當前目錄
    root_dir = "."
    service_dir = "service"
    
    def process_file(filepath, is_sub):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 1. 修正 Favicon 與 Logo 檔案名
            content = content.replace('favicon.ico', 'favicon.svg')
            content = content.replace('logo.png', 'logo.svg')
            
            # 2. 修正子目錄路徑屬性
            if is_sub:
                # 修正資源路徑
                content = re.sub(r'(href|src)="(?!\.\./|http|https|tel:|mailto:|#|/)(assets/.*?)"', r'\1="../\2"', content)
                
                # 修正導覽路徑
                root_pages = ['index.html', 'cases.html', 'about.html', 'process.html', 'faq.html']
                for page in root_pages:
                    # 避免重複添加 ../
                    content = re.sub(r'href="(?!\.\./)' + re.escape(page) + r'(?![^"]*/)', r'href="../' + page, content)
                
                # 特殊處理錨點
                content = re.sub(r'href="\.\./(index\.html#.*?)"', r'href="../\1"', content)

                # 修正內部的 service/ 誤植
                content = content.replace('href="service/', 'href="')
            else:
                # 根目錄頁面確保資源路徑是 assets/
                pass

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
        except Exception as e:
            print(f"Error fixing {filepath}: {e}")

    # 根目錄
    for f in os.listdir(root_dir):
        if f.endswith('.html'):
            process_file(f, False)
            
    # service 目錄
    if os.path.exists(service_dir):
        for f in os.listdir(service_dir):
            if f.endswith('.html'):
                process_file(os.path.join(service_dir, f), True)

if __name__ == "__main__":
    global_fix()
