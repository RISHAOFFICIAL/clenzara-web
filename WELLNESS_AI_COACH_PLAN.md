# Wellness AI Coach — Strategy & Technical Implementation Plan

## Overview
Integrate a lightweight "Wellness AI Coach" chatbot on Clenzara.com that reads quiz results, answers user questions in real-time, and guides visitors toward protocol products — all while running on a static Hostinger-hosted site.

---

## Option 1: Voiceflow (Recommended — Ship in 2 Days)

**Best for:** Speed, no coding, conversational flows, product recommendations

### How It Works
1. Build conversational flows in Voiceflow's drag-and-drop builder
2. Embed a JavaScript widget snippet on `index.html`
3. Pass quiz results to the widget via URL parameters or `window.postMessage`
4. Voiceflow handles the LLM/API calls on their servers

### Implementation Steps

#### Step 1: Create Voiceflow Account
- Sign up at voiceflow.com (Free tier: 1,000 MAU)
- Create a new "Web Chat" agent

#### Step 2: Build the Coach Flow
Trigger on chat open → Greeting based on quiz risk level → Show product recommendations with clenzara-20 links → Answer FAQs from blog knowledge base

#### Step 3: Train on Blog Content
Feed all 5 blog posts into Voiceflow Knowledge Base

#### Step 4: Embed Widget
```html
<script type="text/javascript">
  (function(d,t){var v=d.createElement(t),s=d.getElementsByTagName(t)[0];
  v.onload=function(){window.voiceflow.chat.load({
    verify:{projectID:'YOUR_PROJECT_ID'},
    url:'https://general-runtime.voiceflow.com',
    versionID:'production',
    assistant:{variables:{
      userRiskLevel:new URLSearchParams(window.location.search).get('risk')||'none'
    }}})};v.src="https://cdn.voiceflow.com/widget/bundle.mjs";
  v.type="text/javascript";s.parentNode.insertBefore(v,s);})(document,'script');
</script>
```

## Option 2: Custom OpenAI via Google Apps Script (DIY — 5 Days)

Best for: Full control, ~$0.50/month

Architecture: Chat Widget (HTML/JS) → Google Apps Script (API Proxy) → OpenAI GPT-4o-mini → Response back

## Recommendation

Phase 1 (2 days): Voiceflow - Free tier, ship immediately
Phase 2 (Month 2): Custom OpenAI + GAS - $0.50/month, full control

## Quiz Integration
Add to quiz showResult(): localStorage.setItem('clenzara_quiz_score', score); localStorage.setItem('clenzara_quiz_risk', level); URL param ?risk=low|moderate|high

## Compliance
Every response includes disclaimer. No medical diagnoses. All affiliate links use clenzara-20 tag.