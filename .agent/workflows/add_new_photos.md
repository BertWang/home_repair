---
description: Standard workflow for adding, processing, and integrating new project photos into the website.
---

# New Project Photo Integration Workflow

This workflow defines the standard process for adding new portfolio images to the website, ensuring SEO optimization, consistent formatting, and correct metadata.

## 1. Preparation
1.  Place raw image files (JPG/PNG) into the `新增照片` (New Photos) directory.
2.  Ensure filenames are reasonably descriptive or groupable (e.g., `tiling_project_A_01.jpg`).

## 2. Configuration (Mapping)
1.  Generate or update `image_mapping.json` in the root directory.
2.  **Required Structure**:
    ```json
    {
        "source_file": "original_filename.jpg",
        "category": "tiling",  // Service category (folder name)
        "target_path": "assets/images/projects/tiling/semantic-filename.webp", // Kebab-case, English
        "title": "Case Title", // Display Title
        "service_category_text": "Service Label", // e.g., "貼磚工程"
        "location": "District/City", // e.g., "台南市區"
        "completion_date": "YYYY", // e.g., "2025"
        "seo_alt": "Descriptive Alt Text" // For SEO
    }
    ```
3.  **Filenaming Rule**: Use descriptive Kebab-Case (e.g., `bathroom-renovation-tiling.webp`). Avoid generic numbers.

## 3. Processing (Automation)
1.  Run the processing script (e.g., `process_image_mapping.ps1`).
2.  **Actions performed**:
    -   Converts image to WebP.
    -   Resizes to Max Width `1024px`.
    -   Moves/Renames file to the `target_path`.
    -   Validates success.

## 4. Integration (HTML)
1.  Open the target HTML file (e.g., `service/tiling.html`).
2.  Locate the `#cases` grid section.
3.  Insert new `<article>` blocks using the metadata from `image_mapping.json`.
4.  **Template**:
    ```html
    <article class="md:col-span-2 group relative overflow-hidden rounded-sm reveal">
        <div class="aspect-[16/10] bg-stone-200">
            <img src="../{target_path}" class="..." alt="{seo_alt}">
        </div>
        <div class="absolute inset-0 ... flex flex-col justify-end p-6">
            <span class="... text-xs px-3 py-1 ...">{service_category_text} · {location}</span>
            <h3 class="text-xl font-bold text-white mb-2">{title}</h3>
            <div class="flex justify-between items-end border-t border-white/20 pt-2">
                <span class="text-white/80 text-xs">{completion_date}</span>
            </div>
        </div>
    </article>
    ```

## 5. Verification
1.  Check the page in browser (Localhost).
2.  Verify image quality, layout, and correct metadata display.
