$baseDir = "d:\恩哥YT\home_repair"
$mappingFile = "$baseDir\image_mapping.json"
$targetDir = "$baseDir\assets\images\projects"

# Ensure target directory exists
if (-not (Test-Path -Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
    Write-Host "Created directory: $targetDir"
}

# Load JSON mapping
try {
    $jsonContent = Get-Content -Raw -Path $mappingFile
    $mapping = $jsonContent | ConvertFrom-Json
}
catch {
    Write-Error "Failed to load mapping file."
    exit
}

# Process each category
$folderMap = @{
    "泥作" = "assets\images\泥作";
    "貼磚" = "assets\images\貼磚"
}

foreach ($category in $folderMap.Keys) {
    # Access the property dynamically. 
    # Note: PSObject property access for dynamic keys from JSON
    $files = $mapping.$category

    if ($null -ne $files) {
        $srcSubDir = $folderMap[$category]
        $srcDirFullPath = Join-Path $baseDir $srcSubDir

        # Iterate through properties (filenames)
        foreach ($prop in $files.PSObject.Properties) {
            $originalName = $prop.Name
            $info = $prop.Value
            $newName = $info.new_name
            
            $srcPath = Join-Path $srcDirFullPath $originalName
            $destPath = Join-Path $targetDir $newName

            if (Test-Path $srcPath) {
                Copy-Item -Path $srcPath -Destination $destPath -Force
                Write-Host "✅ Copied: $originalName -> $newName"
            }
            else {
                Write-Warning "⚠️ Source file not found: $srcPath"
            }
        }
    }
}
Write-Host "Done."
