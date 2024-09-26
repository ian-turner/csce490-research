echo "Testing with valid input:"
curl -X POST http://localhost:5000/register -H 'Content-Type: application/json' -d '{"username": "ianturner", "password": "ianturner"}'
echo "\nTesting with invalid input:"
curl -X POST http://localhost:5000/register -H 'Content-Type: application/json' -d '{"username": "ianturner"}'
