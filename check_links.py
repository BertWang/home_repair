import os
import re

def check_paths():
    root_dir = r"d:\恩哥YT\home_repair"
    all_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            all_files.append(os.path.relpath(os.path.join(root, file), root_dir).replace('\\', '/'))

    broken_links = []

    # Regex to find src and href in HTML
    html_pattern = re.compile(r'(?:src|href)=["\'](.*?)["\']')
    # Regex to find url() in CSS
    css_pattern = re.compile(r'url\(["\']?(.*?)["\']?\)')

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.html', '.css')):
                file_path = os.path.join(root, file)
                rel_base = os.path.relpath(root, root_dir).replace('\\', '/')
                if rel_base == '.':
                    rel_base = ''
                
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    
                    if file.endswith('.html'):
                        links = html_pattern.findall(content)
                    else:
                        links = css_pattern.findall(content)
                    
                    for link in links:
                        # Skip remote links, anchor links, and protocols
                        if link.startswith(('http', 'https', 'tel:', 'mailto:', '#', 'data:')) or not link:
                            continue
                        
                        # Clean query params or hashes
                        clean_link = link.split('?')[0].split('#')[0]
                        
                        # Normalize path
                        if clean_link.startswith('/'):
                            # Absolute to root (assuming root is home_repair)
                            path_to_check = clean_link.lstrip('/')
                        else:
                            # Relative to current file
                            if rel_base:
                                path_to_check = os.path.normpath(os.path.join(rel_base, clean_link)).replace('\\', '/')
                            else:
                                path_to_check = os.path.normpath(clean_link).replace('\\', '/')
                        
                        if path_to_check not in all_files and path_to_check.lower() not in [f.lower() for f in all_files]:
                            # Check if it might be a directory or missing file
                            broken_links.append({
                                'file': os.path.relpath(file_path, root_dir),
                                'link': link,
                                'resolved_path': path_to_check
                            })

    print("--- BROKEN LINKS REPORT ---")
    if not broken_links:
        print("No broken links found!")
    else:
        for bl in broken_links:
            print(f"File: {bl['file']} | Link: {bl['link']} | Resolved: {bl['resolved_path']}")

if __name__ == "__main__":
    check_paths()
