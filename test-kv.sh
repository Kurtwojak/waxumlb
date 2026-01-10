#!/bin/bash

# Test script for KV API endpoints
# Update this URL to match your deployment
API_URL="${1:-http://localhost:3000/api/kvtest}"

# Generate random key
RANDOM_KEY="test-key-$(date +%s)-$RANDOM"
RANDOM_VALUE="Hello from test at $(date)"

echo "🧪 Testing KV API at: $API_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: POST - Store a value
echo "📤 [1/2] POST: Storing key=\"$RANDOM_KEY\", value=\"$RANDOM_VALUE\""
POST_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"key\": \"$RANDOM_KEY\", \"value\": \"$RANDOM_VALUE\"}")

echo "POST Response:"
echo "$POST_RESPONSE" | jq '.' 2>/dev/null || echo "$POST_RESPONSE"
echo ""

# Step 2: GET - Retrieve the value
echo "📥 [2/2] GET: Retrieving key=\"$RANDOM_KEY\""
GET_RESPONSE=$(curl -s -X GET "$API_URL?key=$RANDOM_KEY")

echo "GET Response:"
echo "$GET_RESPONSE" | jq '.' 2>/dev/null || echo "$GET_RESPONSE"
echo ""

# Verify
RESULT=$(echo "$GET_RESPONSE" | grep -o "\"result\":\"[^\"]*\"" | cut -d'"' -f4)

if [ "$RESULT" = "$RANDOM_VALUE" ]; then
  echo "✅ SUCCESS: Value stored and retrieved correctly!"
  echo "   Expected: \"$RANDOM_VALUE\""
  echo "   Got:      \"$RESULT\""
else
  echo "❌ FAIL: Value mismatch!"
  echo "   Expected: \"$RANDOM_VALUE\""
  echo "   Got:      \"$RESULT\""
fi
