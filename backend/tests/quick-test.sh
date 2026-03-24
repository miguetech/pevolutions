#!/bin/bash
# Script de pruebas rápidas con curl
# Uso: ./quick-test.sh

BASE_URL="http://localhost:8000"
TOKEN=""

echo "🚀 PEvolutions API - Quick Test"
echo "================================"

# Health check
echo -e "\n✅ 1. Health Check"
curl -s $BASE_URL/health | jq '.'

# Register
echo -e "\n✅ 2. Register"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"testuser_$(date +%s)\",\"password\":\"test123\",\"email\":\"test_$(date +%s)@test.com\"}")
echo $REGISTER_RESPONSE | jq '.'
USERNAME=$(echo $REGISTER_RESPONSE | jq -r '.name')

# Login
echo -e "\n✅ 3. Login"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$USERNAME\",\"password\":\"test123\"}")
echo $LOGIN_RESPONSE | jq '.'
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "Token obtenido: ${TOKEN:0:20}..."
  
  # Get Players
  echo -e "\n✅ 4. Get My Players"
  curl -s $BASE_URL/api/players/ \
    -H "Authorization: Bearer $TOKEN" | jq '.'
  
  # Create Player
  echo -e "\n✅ 5. Create Player"
  CREATE_PLAYER=$(curl -s -X POST $BASE_URL/api/players/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Player_$(date +%s)\",\"sex\":0}")
  echo $CREATE_PLAYER | jq '.'
  PLAYER_NAME=$(echo $CREATE_PLAYER | jq -r '.name')
  
  # Account Stats
  echo -e "\n✅ 6. Account Stats"
  curl -s $BASE_URL/api/account/stats \
    -H "Authorization: Bearer $TOKEN" | jq '.'
else
  echo "❌ No se pudo obtener token"
fi

# Online Players (público)
echo -e "\n✅ 7. Online Players"
curl -s "$BASE_URL/api/players/online?limit=5" | jq '.'

# Events (público)
echo -e "\n✅ 8. Events"
curl -s $BASE_URL/api/events | jq '.'

# Guilds (público)
echo -e "\n✅ 9. Guilds"
curl -s $BASE_URL/api/guilds | jq '.'

# Shop Packages (público)
echo -e "\n✅ 10. Shop Packages"
curl -s $BASE_URL/api/shop/packages | jq '.'

echo -e "\n================================"
echo "✅ Tests completados"
