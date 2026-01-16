import os
import re

def fix_service_paths():
    service_dir = r"d:\恩哥YT\home_repair\service"
    
    # 檔案清單
    target_files = [f for f in os.listdir(service_dir) if f.endswith('.html')]
    
    for filename in target_files:
        filepath = os.path.join(service_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. 修復誤植的 service/ 前綴 (在子目錄頁面連結其他同級頁面時不需要 service/)
        content = content.replace('href="service/', 'href="')
        
        # 2. 修復導覽至根目錄頁面的路徑 (需加上 ../)
        # 匹配 index.html, cases.html, about.html, process.html, faq.html, contact.html
        root_pages = ['index.html', 'cases.html', 'about.html', 'process.html', 'faq.html']
        for page in root_pages:
            # 確保不會重複添加 ../ (避免變成 ../../index.html)
            # 使用正則表達式，確保前面不是 ../ 也不包含其餘路徑符號
            pattern = r'(?<!\.\./)href="' + re.escape(page) + r'"'
            content = re.sub(pattern, 'href="../' + page + '"', content)

        # 3. 修復資源路徑 (favicon, assets 等，若有遺漏)
        # 匹配 href="assets/ 或 src="assets/ 
        content = re.sub(r'href="assets/', 'href="../assets/', content)
        content = re.sub(r'src="assets/', 'src="../assets/', content)
        
        # 4. 特殊情況：如果 href="../index.html#services" 這種錨點
        content = re.sub(r'href="index.html#(.*?)"', r'href="../index.html#\1"', content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed: {filename}")

if __name__ == "__main__":
    fix_service_paths()
