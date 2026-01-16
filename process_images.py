import json
import os
from PIL import Image, ImageOps, ImageEnhance

# Configuration
SOURCE_DIRS = {
    "泥作": r"d:\恩哥YT\home_repair\assets\images\泥作",
    "貼磚": r"d:\恩哥YT\home_repair\assets\images\貼磚"
}
TARGET_DIR = r"d:\恩哥YT\home_repair\assets\images\projects"
MAPPING_FILE = r"d:\恩哥YT\home_repair\image_mapping.json"

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")

def process_image(src_path, dest_path):
    try:
        with Image.open(src_path) as img:
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # 1. Auto Contrast (Smart Levels) - fixes underexposure/haze
            # cutoff=0.5 ignores the top/bottom 0.5% pixels to avoid outliers skewing the result
            enhanced_img = ImageOps.autocontrast(img, cutoff=0.5) 
            
            # 2. Slight Brightness Boost (many construction site photos are dim)
            # brightness = ImageEnhance.Brightness(enhanced_img)
            # enhanced_img = brightness.enhance(1.05) # 5% boost

            # 3. Sharpening (Essential for texture in masonry/mud work)
            sharpness = ImageEnhance.Sharpness(enhanced_img)
            enhanced_img = sharpness.enhance(1.3) # 30% sharpening
            
            # Save
            enhanced_img.save(dest_path, quality=85, optimize=True)
            print(f"✅ Processed: {os.path.basename(dest_path)}")
            return True
            
    except Exception as e:
        print(f"❌ Error processing {src_path}: {e}")
        return False

def main():
    print("Starting visual asset processing...")
    
    # Check mapping file
    if not os.path.exists(MAPPING_FILE):
        print(f"Mapping file not found: {MAPPING_FILE}")
        return

    # Load mapping
    with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
        mapping = json.load(f)
    
    ensure_dir(TARGET_DIR)
    
    success_count = 0
    total_count = 0
    
    for category, files in mapping.items():
        src_dir = SOURCE_DIRS.get(category)
        if not src_dir or not os.path.exists(src_dir):
            print(f"⚠️ Source directory missing for category: {category}")
            continue
            
        for original_name, info in files.items():
            total_count += 1
            src_path = os.path.join(src_dir, original_name)
            new_name = info['new_name']
            dest_path = os.path.join(TARGET_DIR, new_name)
            
            if os.path.exists(src_path):
                if process_image(src_path, dest_path):
                    success_count += 1
            else:
                print(f"⚠️ Source file not found: {src_path}")

    print(f"\nProcessing Complete: {success_count}/{total_count} images successfully processed.")

if __name__ == "__main__":
    main()
