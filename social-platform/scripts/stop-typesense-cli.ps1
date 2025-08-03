# Stop and disable Typesense service (Windows)
# Run this script as Administrator

# Check if Typesense service exists
$service = Get-Service -Name "Typesense" -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "Stopping Typesense service..."
    Stop-Service -Name "Typesense" -Force
    
    Write-Host "Disabling Typesense service..."
    Set-Service -Name "Typesense" -StartupType Disabled
    
    Write-Host "Typesense service has been stopped and disabled."
}
else {
    Write-Host "Typesense service not found. It may have been uninstalled already."
}

# Check for Typesense process running directly
$processes = Get-Process -Name "typesense*" -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "Found running Typesense processes. Stopping them..."
    $processes | Stop-Process -Force
    Write-Host "Typesense processes stopped."
}
else {
    Write-Host "No Typesense processes found running."
}

Write-Host "You can now use the Docker container for Typesense."
Write-Host "Run 'docker-compose up -d typesense' to start the Typesense container."
