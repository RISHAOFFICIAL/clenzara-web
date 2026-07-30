#!/bin/bash
# IndexNow — Submit all Clenzara blog URLs to Bing, Yandex, Seznam, etc.
# Run this after every deployment to notify search engines of new/updated content.
# Usage: bash submit-indexnow.sh

INDEXNOW_KEY="879d53a17ee74a359df606c3ce567de5"
HOST="clenzara.com"
KEY_LOCATION="https://${HOST}/${INDEXNOW_KEY}.txt"

# All 14 blog URLs
URLS=(
  "https://clenzara.com/blog/17-signs-of-biological-disharmony.html"
  "https://clenzara.com/blog/biofilm-disruptors.html"
  "https://clenzara.com/blog/cyclospora-digestive-resilience-guide.html"
  "https://clenzara.com/blog/cyclospora-outbreak-wellness-support.html"
  "https://clenzara.com/blog/cyclospora-recovery-timeline-wellness-support.html"
  "https://clenzara.com/blog/cyclospora-vs-giardia-comparison-wellness.html"
  "https://clenzara.com/blog/detroit-michigan-cyclospora-wellness-guide.html"
  "https://clenzara.com/blog/digestive-resilience-traditional-wellness.html"
  "https://clenzara.com/blog/drainage-pathways.html"
  "https://clenzara.com/blog/full-moon-biological-connection.html"
  "https://clenzara.com/blog/michigan-cyclospora-wellness-support.html"
  "https://clenzara.com/blog/pro-app-conversion.html"
  "https://clenzara.com/blog/taco-bell-cyclospora-wellness-support.html"
  "https://clenzara.com/blog/taylor-farms-cyclospora-wellness-support.html"
)

# Build JSON payload
PAYLOAD=$(printf '%s\n' "${URLS[@]}" | jq -R -s -c '{
  host: "clenzara.com",
  key: "'"$INDEXNOW_KEY"'",
  keyLocation: "'"$KEY_LOCATION"'",
  urlList: split("\n") | map(select(length > 0))
}')

echo "🚀 Submitting ${#URLS[@]} URLs to IndexNow..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "202" ]; then
  echo "✅ IndexNow accepted. HTTP $HTTP_CODE"
  echo "   Bing, Yandex, Seznam notified."
else
  echo "⚠️  IndexNow returned HTTP $HTTP_CODE"
  echo "   Response: $BODY"
fi

echo ""
echo "🔍 Search engines covered by this submission:"
echo "   Bing → Also feeds DuckDuckGo, Yahoo, Ecosia, Qwant"
echo "   Yandex → Russian search market"
echo "   Seznam → Czech search market"
echo ""
echo "📋 Still needs owner action:"
echo "   Google Search Console → https://search.google.com/search-console"
echo "   (Google doesn't use IndexNow — requires manual sitemap submission)"
