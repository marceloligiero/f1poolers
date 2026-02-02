# Test all API routes
Write-Host "🧪 Testing F1 Poolers API" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

$apiUrl = "http://localhost:3001/api"
$passed = 0
$failed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = $null
    )
    
    try {
        $params = @{
            Uri = "$apiUrl$Endpoint"
            Method = $Method
            UseBasicParsing = $true
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host "✅ $Name" -ForegroundColor Green
            $script:passed++
            return $response.Content | ConvertFrom-Json
        } else {
            Write-Host "❌ $Name - Status: $($response.StatusCode)" -ForegroundColor Red
            $script:failed++
            return $null
        }
    } catch {
        Write-Host "❌ $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
        return $null
    }
}

# 1. Health Check
Write-Host "1️⃣  Testing Health Check..." -ForegroundColor Yellow
Test-Endpoint -Name "GET /health" -Endpoint "/health"
Write-Host ""

# 2. Teams
Write-Host "2️⃣  Testing Teams..." -ForegroundColor Yellow
$teams = Test-Endpoint -Name "GET /teams" -Endpoint "/teams"
if ($teams) {
    Write-Host "   Found $($teams.Count) teams" -ForegroundColor Gray
}
Write-Host ""

# 3. Drivers
Write-Host "3️⃣  Testing Drivers..." -ForegroundColor Yellow
$drivers = Test-Endpoint -Name "GET /drivers" -Endpoint "/drivers"
if ($drivers) {
    Write-Host "   Found $($drivers.Count) drivers" -ForegroundColor Gray
    $firstDriver = $drivers[0]
    Test-Endpoint -Name "GET /drivers/:id ($($firstDriver.name))" -Endpoint "/drivers/$($firstDriver.id)"
}
Write-Host ""

# 4. Signup
Write-Host "4️⃣  Testing User Signup..." -ForegroundColor Yellow
$timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
$newUser = Test-Endpoint -Name "POST /auth/signup" -Endpoint "/auth/signup" -Method "POST" -Body @{
    username = "testuser_$timestamp"
    password = "test123"
    age = 25
    country = "Brazil"
}
if ($newUser) {
    Write-Host "   Created user: $($newUser.username)" -ForegroundColor Gray
}
Write-Host ""

# 5. Login
Write-Host "5️⃣  Testing Login..." -ForegroundColor Yellow
if ($newUser) {
    $loginUser = Test-Endpoint -Name "POST /auth/login" -Endpoint "/auth/login" -Method "POST" -Body @{
        username = $newUser.username
        password = "test123"
    }
    if ($loginUser) {
        Write-Host "   Logged in as: $($loginUser.username)" -ForegroundColor Gray
    }
}
Write-Host ""

# 6. Invalid Login
Write-Host "6️⃣  Testing Invalid Login..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "$apiUrl/auth/login" -Method POST -Body (@{username="invalid"; password="wrong"} | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing | Out-Null
    Write-Host "❌ Should have failed but didn't" -ForegroundColor Red
    $script:failed++
} catch {
    Write-Host "✅ POST /auth/login (invalid) - Correctly rejected" -ForegroundColor Green
    $script:passed++
}
Write-Host ""

# 7. Users
Write-Host "7️⃣  Testing Get Users..." -ForegroundColor Yellow
$users = Test-Endpoint -Name "GET /users" -Endpoint "/users"
if ($users) {
    Write-Host "   Found $($users.Count) users" -ForegroundColor Gray
}
Write-Host ""

# 8. User by ID
Write-Host "8️⃣  Testing Get User by ID..." -ForegroundColor Yellow
if ($newUser) {
    $user = Test-Endpoint -Name "GET /users/:id" -Endpoint "/users/$($newUser.id)"
    if ($user) {
        Write-Host "   User: $($user.username), Balance: $($user.balance)" -ForegroundColor Gray
    }
}
Write-Host ""

# 9. Update Balance
Write-Host "9️⃣  Testing Update Balance..." -ForegroundColor Yellow
if ($newUser) {
    $updated = Test-Endpoint -Name "PATCH /users/:id/balance" -Endpoint "/users/$($newUser.id)/balance" -Method "PATCH" -Body @{ amount = 50 }
    if ($updated) {
        Write-Host "   New balance: $($updated.balance)" -ForegroundColor Gray
    }
}
Write-Host ""

# 10. Update Points
Write-Host "🔟 Testing Update Points..." -ForegroundColor Yellow
if ($newUser) {
    $updated = Test-Endpoint -Name "PATCH /users/:id/points" -Endpoint "/users/$($newUser.id)/points" -Method "PATCH" -Body @{ amount = 100 }
    if ($updated) {
        Write-Host "   New points: $($updated.points)" -ForegroundColor Gray
    }
}
Write-Host ""

# 11. Leagues
Write-Host "1️⃣1️⃣ Testing Leagues..." -ForegroundColor Yellow
$leagues = Test-Endpoint -Name "GET /leagues" -Endpoint "/leagues"
if ($leagues) {
    Write-Host "   Found $($leagues.Count) leagues" -ForegroundColor Gray
    if ($leagues.Count -gt 0) {
        $firstLeague = $leagues[0]
        Test-Endpoint -Name "GET /leagues/:id ($($firstLeague.name))" -Endpoint "/leagues/$($firstLeague.id)"
    }
}
Write-Host ""

# 12. Rounds
Write-Host "1️⃣2️⃣ Testing Rounds..." -ForegroundColor Yellow
$rounds = Test-Endpoint -Name "GET /rounds" -Endpoint "/rounds"
if ($rounds) {
    Write-Host "   Found $($rounds.Count) rounds" -ForegroundColor Gray
}
Write-Host ""

# 13. Events
Write-Host "1️⃣3️⃣ Testing Events..." -ForegroundColor Yellow
$events = Test-Endpoint -Name "GET /events" -Endpoint "/events"
if ($events) {
    Write-Host "   Found $($events.Count) events" -ForegroundColor Gray
}
Write-Host ""

# 14. Bets
Write-Host "1️⃣4️⃣ Testing Bets..." -ForegroundColor Yellow
$bets = Test-Endpoint -Name "GET /bets" -Endpoint "/bets"
if ($bets) {
    Write-Host "   Found $($bets.Count) bets" -ForegroundColor Gray
}
Write-Host ""

# 15. Results
Write-Host "1️⃣5️⃣ Testing Results..." -ForegroundColor Yellow
$results = Test-Endpoint -Name "GET /results" -Endpoint "/results"
if ($results) {
    Write-Host "   Found $($results.Count) results" -ForegroundColor Gray
}
Write-Host ""

# Summary
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "Total Tests: $($passed + $failed)"
Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red
$successRate = if (($passed + $failed) -gt 0) { [math]::Round(($passed / ($passed + $failed)) * 100, 1) } else { 0 }
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "✨ Tests completed!" -ForegroundColor Cyan
