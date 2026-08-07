#!/bin/bash
# IndexNow — Submit ALL Clenzara URLs (from live sitemap) to Bing, Yandex, Seznam, etc.
# Run this after every deployment to notify search engines of new/updated content.
# Usage: bash submit-indexnow.sh
INDEXNOW_KEY="879d53a17ee74a359df606c3ce567de5"
HOST="clenzara.com"
KEY_LOCATION="https://${HOST}/${INDEXNOW_KEY}.txt"

# Pull all URLs from the live sitemap
URLS=$(curl -s "https://clenzara.com/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//;s/<\/loc>//')

echo "🚀 Found $(echo "$URLS" | wc -l) URLs in sitemap, submitting to IndexNow..."

# Build JSON payload
PAYLOAD=$(printf '%s\n' "$URLS" | jq -R -s -c '{
  host: "clenzara.com",
  key: "'"$INDEXNOW_KEY"'",
  keyLocation: "'"$KEY_LOCATION"'",
  urlList: split("\n") | map(select(length > 0))
}')
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "202" ]; then
  echo "✅ IndexNow accepted. HTTP $HTTP_CODE — Bing, Yandex, Seznam notified."
else
  echo "⚠️  IndexNow returned HTTP $HTTP_CODE"
  echo "   Response: $BODY"
fi
echo ""
echo "📋 Google still needs owner action (manual sitemap submission in Search Console):"
echo "   https://search.google.com/search-console"
