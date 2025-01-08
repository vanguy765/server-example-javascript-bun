# Define the body of the request
$body = @{
    fromNumber = '+16042106553'
    toNumber = '+17787754146'
    companyAgentName = 'Test Agent'
    companyAgentDir = 'test/agent/dir'
    demo = $true
    agentName = 'Test Agent'
    agentTransient = $true
}

# Convert the body to JSON
$bodyJson = $body | ConvertTo-Json

# Invoke the POST request
#Invoke-RestMethod -Uri http://localhost:3000/submit -Method Post -Body $bodyJson -ContentType 'application/json'

Invoke-RestMethod -Uri http://localhost:3000/forms/submit -Method Post -Body $bodyJson -ContentType 'application/json'

# .\powershellScripts\submit-request.ps1
# .\powershellScripts\submit-request.ps1
