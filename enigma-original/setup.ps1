$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
foreach ($tool in @('py','node','npm.cmd','ffmpeg','ffprobe')) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
        throw "Missing $tool. Install the prerequisites listed in README.md, then run setup.ps1 again."
    }
}
py -3.12 -m venv .venv
if ($LASTEXITCODE) { throw 'Python 3.12 environment creation failed.' }
& .\.venv\Scripts\python.exe -m pip install -r requirements.txt
if ($LASTEXITCODE) { throw 'Python dependency installation failed.' }
npm.cmd install --no-audit --no-fund
if ($LASTEXITCODE) { throw 'Canvas installation failed.' }
Write-Host 'Ready. Rebuild with .\.venv\Scripts\python.exe studio.py build'
