$mappingFile = "image_mapping.json"
$sourceBaseDir = "新增照片"

if (-not (Test-Path $mappingFile)) {
    Write-Error "Mapping file not found: $mappingFile"
    exit 1
}

$mapping = Get-Content $mappingFile | ConvertFrom-Json

foreach ($item in $mapping) {
    if ($item.action -eq "skip") { continue }

    $sourcePath = Join-Path $sourceBaseDir $item.source_file
    $targetPath = $item.target_path
    
    # Ensure target directory exists
    $targetDir = Split-Path $targetPath -Parent
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    }

    if (Test-Path $sourcePath) {
        Write-Host "Processing: $($item.source_file) -> $targetPath"
        
        # FFmpeg conversion: WebP, MaxWidth 1024
        # -y: Overwrite output
        # -v error: Quiet
        # scale='min(1024,iw)':-2 : Scale to 1024 if larger, keep aspect ratio. -2 ensures even dimensions for standard codecs.
        
        $ffmpegCommand = "ffmpeg -y -v error -i `"$sourcePath`" -vf `"scale='min(1024,iw)':-2`" `"$targetPath`""
        Invoke-Expression $ffmpegCommand
        
        if (Test-Path $targetPath) {
            Write-Host "  [OK] Created $targetPath"
        }
        else {
            Write-Error "  [FAIL] Failed to create $targetPath"
        }
    }
    else {
        Write-Warning "Source file not found: $sourcePath"
    }
}

Write-Host "Batch Processing Complete."
