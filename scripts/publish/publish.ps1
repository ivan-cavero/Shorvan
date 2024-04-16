$BASE_HOME = (Split-Path -Parent -Path $MyInvocation.MyCommand.Definition)
$PUBLISH_DIST = "publish"

if (-not (Test-Path -Path "$BASE_HOME\$PUBLISH_DIST")) {
    Write-Host "publish dir not found. Please build first."
    exit 1
}

$DIR_TARGET = "$BASE_HOME\$PUBLISH_DIST"
Set-Location -Path $DIR_TARGET -ErrorAction Stop
bun run publish
Write-Host "publish finish!!!"
Remove-Item -Path $DIR_TARGET -Recurse -Force
