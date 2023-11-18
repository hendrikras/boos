# Define the API Gateway URL
$apiUrl = "https://xkbknfcuvyhjgv4bo3q77hhghm0vomfa.lambda-url.eu-central-1.on.aws/"

# Define the data to pass to the Lambda function
$data = @{
    PlayerName = "Bob"
    Score = 5500
}

# Convert the data to JSON
$jsonData = $data | ConvertTo-Json

# Send the POST request
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -ContentType "application/json" -Body $jsonData

# Display the response
$response
