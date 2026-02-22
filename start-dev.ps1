Write-Host "Avvio PortalSolution..." -ForegroundColor Cyan

# Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/PortalApi; dotnet watch run"

# Attesa breve per evitare race condition
Start-Sleep -Seconds 2

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/portal-ui; npm run dev"

Write-Host "Backend e Frontend avviati!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5202/swagger"
Write-Host "Frontend: http://localhost:5173"
