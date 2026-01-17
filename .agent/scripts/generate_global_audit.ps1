$currentCsv = Import-Csv "temp_images.csv"
$newMapping = Get-Content "image_mapping.json" | ConvertFrom-Json

$auditReport = @()

# 1. Process Existing Usage (from temp_images.csv)
foreach ($row in $currentCsv) {
    if ($row.Value -match "assets/images") {
        # Try to extract category from path
        $category = "misc"
        if ($row.Value -match "projects/(\w+)") { $category = $matches[1] }
        
        $auditReport += [PSCustomObject]@{
            Type        = "Existing"
            SourceFile  = $row.Filename
            ImagePath   = $row.Value
            Category    = $category
            Status      = "In Use"
            Description = "Detected in HTML"
            Location    = ""
            Date        = ""
        }
    }
}

# 2. Process New Images (from image_mapping.json)
foreach ($item in $newMapping) {
    $auditReport += [PSCustomObject]@{
        Type        = "New"
        SourceFile  = $item.source_file
        ImagePath   = $item.target_path
        Category    = $item.category
        Status      = "Pending Integration"
        Description = $item.seo_alt
        Location    = $item.location
        Date        = $item.completion_date
    }
}

# 3. Export to consolidated CSV
$auditReport | Export-Csv -Path "global_image_audit.csv" -NoTypeInformation -Encoding UTF8
Write-Host "Audit Complete. specific 'global_image_audit.csv' created."
