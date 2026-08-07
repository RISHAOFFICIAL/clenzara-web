#!/bin/bash
# IndexNow — Submit all Clenzara URLs to Bing, Yandex, Seznam, etc.
# Run this after every deployment to notify search engines of new/updated content.
# Usage: bash submit-indexnow.sh
#
# Upgraded v2.0 — covers all 60+ site pages (blog, programmatic SEO, learn hub, policies)
INDEXNOW_KEY="879d53a17ee74a359df606c3ce567de5"
HOST="clenzara.com"
KEY_LOCATION="https://${HOST}/${INDEXNOW_KEY}.txt"

URLS=(
  # === Core Pages (5) ===
  "https://clenzara.com/"
  "https://clenzara.com/privacy-policy.html"
  "https://clenzara.com/terms.html"
  "https://clenzara.com/unsubscribe.html"
  "https://clenzara.com/shop/digestive-resilience-protocol.html"

  # === Blog Posts (17) ===
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
  "https://clenzara.com/blog/gut-health-reset-2026.html"
  "https://clenzara.com/blog/michigan-cyclospora-wellness-support.html"
  "https://clenzara.com/blog/parasite-cleanse-tiktok-truth.html"
  "https://clenzara.com/blog/pro-app-conversion.html"
  "https://clenzara.com/blog/summer-mucus-elimination-guide.html"
  "https://clenzara.com/blog/taco-bell-cyclospora-wellness-support.html"
  "https://clenzara.com/blog/taylor-farms-cyclospora-wellness-support.html"

  # === Programmatic SEO — Herb × Benefit Pages (25) ===
  "https://clenzara.com/programmatic/activated-charcoal-detox-flux-bloating.html"
  "https://clenzara.com/programmatic/activated-charcoal-emunctory-support-skin.html"
  "https://clenzara.com/programmatic/berberine-intracellular-cleansing-cravings.html"
  "https://clenzara.com/programmatic/berberine-metabolic-harmony-weight.html"
  "https://clenzara.com/programmatic/berberine-microbiome-fatigue.html"
  "https://clenzara.com/programmatic/black-garlic-biological-order-aging.html"
  "https://clenzara.com/programmatic/black-garlic-systemic-wellness-longevity.html"
  "https://clenzara.com/programmatic/black-walnut-alkaline-foundation-heaviness.html"
  "https://clenzara.com/programmatic/black-walnut-microbial-order-brain-fog.html"
  "https://clenzara.com/programmatic/liver-complex-hepatic-restoration-hormonal.html"
  "https://clenzara.com/programmatic/magnesium-bowel-regularity-sleep.html"
  "https://clenzara.com/programmatic/magnesium-mineral-replenishment-tension.html"
  "https://clenzara.com/programmatic/milk-thistle-bile-flow-absorption.html"
  "https://clenzara.com/programmatic/nac-antioxidant-defense-environmental.html"
  "https://clenzara.com/programmatic/nac-liver-support-vitality.html"
  "https://clenzara.com/programmatic/oregano-oil-biological-load-seasonal.html"
  "https://clenzara.com/programmatic/oregano-oil-intestinal-harmony-skin-issues.html"
  "https://clenzara.com/programmatic/oregano-oil-microbial-balance-oral.html"
  "https://clenzara.com/programmatic/probiotics-microbiome-balance-resilience.html"
  "https://clenzara.com/programmatic/probiotics-sentinel-support-clarity.html"
  "https://clenzara.com/programmatic/serrapeptase-biofilm-defense-joint-comfort.html"
  "https://clenzara.com/programmatic/serrapeptase-systemic-restoration-respiratory.html"
  "https://clenzara.com/programmatic/wormwood-biological-harmony-foodborne.html"
  "https://clenzara.com/programmatic/wormwood-biological-resilience-travel.html"
  "https://clenzara.com/programmatic/wormwood-gut-barrier-digestive-distress.html"

  # === Knowledge Hub — Learn Articles (17, excluding index.html) ===
  "https://clenzara.com/learn/alcohol-and-biological-cleanse.html"
  "https://clenzara.com/learn/are-coffee-enemas-necessary-for-drainage.html"
  "https://clenzara.com/learn/best-binder-for-biological-cleansing.html"
  "https://clenzara.com/learn/best-biofilm-disruptors-for-beginners.html"
  "https://clenzara.com/learn/bile-flow-bitters-microbial.html"
  "https://clenzara.com/learn/biological-full-moon-activity.html"
  "https://clenzara.com/learn/castor-oil-packs-detox-science.html"
  "https://clenzara.com/learn/foodborne-wellness-digestive-resilience.html"
  "https://clenzara.com/learn/foodborne-wellness-traditional-support.html"
  "https://clenzara.com/learn/how-long-does-detox-flux-reaction-last.html"
  "https://clenzara.com/learn/how-to-open-drainage-pathways.html"
  "https://clenzara.com/learn/lymphatic-support-dry-brushing.html"
  "https://clenzara.com/learn/mineral-balance-drainage-prep.html"
  "https://clenzara.com/learn/seeing-biological-matter-in-stool.html"
  "https://clenzara.com/learn/sushi-during-biological-cleanse.html"
  "https://clenzara.com/learn/sweat-sauna-skin-drainage.html"
  "https://clenzara.com/learn/what-are-rope-worms.html"
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
  echo "   ${#URLS[@]} URLs submitted to Bing, Yandex, Seznam."
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
