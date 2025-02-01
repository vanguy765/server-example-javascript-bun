# Define the body of the request
# agentType = 'transient'
# agentType = 'assistantOverides'
# agentType = 'variableValues'
$body = @{
    fromNumber       = '2367055080'
    toNumber         = '7787754146'
    companyAgentName = 'Test Agent'
    companyAgentDir  = 'test/agent/dir'
    agentType        = 'assistantOverrides'
    demo             = $true
    agentName        = 'default'
    agentTransient   = $true
}

# Convert the body to JSON
$bodyJson = $body | ConvertTo-Json

# Invoke the POST request
#Invoke-RestMethod -Uri http://localhost:3000/submit -Method Post -Body $bodyJson -ContentType 'application/json'

Invoke-RestMethod -Uri http://localhost:3000/forms/submit -Method Post -Body $bodyJson -ContentType 'application/json'

# .\powershellScripts\submit-request.ps1
# .\powershellScripts\submit-request.ps1
