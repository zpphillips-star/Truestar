#!/usr/bin/env pwsh
# publish-extension.ps1
# Bumps version, zips extension, uploads to Chrome Web Store, publishes.
# Usage: .\scripts\publish-extension.ps1 [-BumpType patch|minor|major] [-DryRun]

param(
    [string]$BumpType = "patch",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# ── Config ──────────────────────────────────────────────────────────────────
# Credentials are stored in scripts/.env.publish (gitignored)
# Format: KEY=VALUE, one per line
$envFile = Join-Path $PSScriptRoot ".env.publish"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim())
        }
    }
}

$CLIENT_ID     = $env:CWS_CLIENT_ID
$CLIENT_SECRET = $env:CWS_CLIENT_SECRET
$REFRESH_TOKEN = $env:CWS_REFRESH_TOKEN
$EXTENSION_ID  = $env:CWS_EXTENSION_ID

if (-not $CLIENT_ID -or -not $CLIENT_SECRET -or -not $REFRESH_TOKEN -or -not $EXTENSION_ID) {
    Write-Host "❌ Missing credentials. Create scripts/.env.publish with:" -ForegroundColor Red
    Write-Host "   CWS_CLIENT_ID=..."
    Write-Host "   CWS_CLIENT_SECRET=..."
    Write-Host "   CWS_REFRESH_TOKEN=..."
    Write-Host "   CWS_EXTENSION_ID=..."
    exit 1
}

$REPO_ROOT   = Split-Path $PSScriptRoot -Parent
$EXT_DIR     = Join-Path $REPO_ROOT "extension"
$MANIFEST    = Join-Path $EXT_DIR "manifest.json"
$ZIP_OUTPUT  = Join-Path $REPO_ROOT "truestar-extension.zip"
# ────────────────────────────────────────────────────────────────────────────

Write-Host "🌟 TrueStar Chrome Web Store Publisher" -ForegroundColor Cyan

# Step 1 — Bump version in manifest.json
$manifestObj = Get-Content $MANIFEST -Raw | ConvertFrom-Json
$oldVersion = $manifestObj.version
$parts = $oldVersion -split '\.' | ForEach-Object { [int]$_ }

switch ($BumpType) {
    "major" { $parts[0]++; $parts[1] = 0; $parts[2] = 0 }
    "minor" { $parts[1]++; $parts[2] = 0 }
    "patch" { $parts[2]++ }
}

$newVersion = $parts -join '.'
Write-Host "📦 Version: $oldVersion → $newVersion"

if (-not $DryRun) {
    $manifestRaw = Get-Content $MANIFEST -Raw
    $manifestRaw = $manifestRaw -replace '"version":\s*"[^"]+"', """version"": ""$newVersion"""
    Set-Content -Path $MANIFEST -Value $manifestRaw -NoNewline
}

# Step 2 — Zip the extension directory
Write-Host "🗜️  Zipping extension..."
if (Test-Path $ZIP_OUTPUT) { Remove-Item $ZIP_OUTPUT }

if (-not $DryRun) {
    Compress-Archive -Path "$EXT_DIR\*" -DestinationPath $ZIP_OUTPUT
    Write-Host "✅ Zip created: $ZIP_OUTPUT"
}

if ($DryRun) {
    Write-Host "🔍 Dry run — stopping before upload" -ForegroundColor Yellow
    exit 0
}

# Step 3 — Get fresh access token
Write-Host "🔑 Getting access token..."
$tokenResponse = Invoke-RestMethod -Method Post -Uri "https://oauth2.googleapis.com/token" -Body @{
    client_id     = $CLIENT_ID
    client_secret = $CLIENT_SECRET
    refresh_token = $REFRESH_TOKEN
    grant_type    = "refresh_token"
}
$accessToken = $tokenResponse.access_token
Write-Host "✅ Access token obtained"

# Step 4 — Upload zip to Chrome Web Store
Write-Host "⬆️  Uploading to Chrome Web Store..."
$uploadUrl = "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$EXTENSION_ID"
$zipBytes  = [System.IO.File]::ReadAllBytes($ZIP_OUTPUT)

$uploadResponse = Invoke-RestMethod -Method Put -Uri $uploadUrl `
    -Headers @{
        Authorization = "Bearer $accessToken"
        "x-goog-api-version" = "2"
    } `
    -ContentType "application/zip" `
    -Body $zipBytes

if ($uploadResponse.uploadState -eq "SUCCESS") {
    Write-Host "✅ Upload successful"
} else {
    Write-Host "❌ Upload failed:" -ForegroundColor Red
    $uploadResponse | ConvertTo-Json | Write-Host
    exit 1
}

# Step 5 — Publish
Write-Host "🚀 Publishing..."
$publishResponse = Invoke-RestMethod -Method Post `
    -Uri "https://www.googleapis.com/chromewebstore/v1.1/items/$EXTENSION_ID/publish" `
    -Headers @{
        Authorization = "Bearer $accessToken"
        "x-goog-api-version" = "2"
    }

if ($publishResponse.status -contains "OK") {
    Write-Host "🌟 Published! v$newVersion is live (pending store review)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Publish response:" -ForegroundColor Yellow
    $publishResponse | ConvertTo-Json | Write-Host
}

# Step 6 — Commit the version bump
Write-Host "📝 Committing version bump..."
Set-Location $REPO_ROOT
git add extension/manifest.json
git commit -m "chore: bump extension to v$newVersion"
git push

Write-Host ""
Write-Host "✅ Done! TrueStar v$newVersion submitted for Chrome Web Store review." -ForegroundColor Green
Write-Host "   Review usually takes a few hours to 1 business day."
