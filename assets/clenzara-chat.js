// Clenzara Wellness Coach — Product Recommendation Chat
// Self-contained, no external dependencies. Drops into any page.

(function() {
  // Product catalog with keywords for matching
  const products = [
    { name: "Wormwood (ImmuneG.I.)", url: "https://www.amazon.com/dp/B0FFBKD6GX/?tag=clenzara-20", price: "$10.00", keywords: ["wormwood", "cleanse", "core", "cleansing", "intestinal", "parasite", "mucus", "gut barrier", "digestive"] },
    { name: "Cloves (Dr. Clark Store)", url: "https://www.amazon.com/dp/B000FT50GA/?tag=clenzara-20", price: "$12.99", keywords: ["clove", "cloves", "essential oil", "eugenol", "antimicrobial"] },
    { name: "Berberine (Doctors' Preferred)", url: "https://www.amazon.com/dp/B0CBCLCWCY/?tag=clenzara-20", price: "$24.99", keywords: ["berberine", "microbiome", "blood sugar", "metabolic", "cravings", "weight", "fatigue", "energy"] },
    { name: "Oregano Oil (Dr. Rajsree, MD)", url: "https://www.amazon.com/dp/B0G1VVYJFD/?tag=clenzara-20", price: "$14.99", keywords: ["oregano", "oregano oil", "carvacrol", "immune", "defense", "sinus", "respiratory", "seasonal", "sick"] },
    { name: "Serrapeptase (Dr. Mercola)", url: "https://www.amazon.com/dp/B08SQ7CCKG/?tag=clenzara-20", price: "$19.99", keywords: ["serrapeptase", "enzyme", "biofilm", "cyst", "joint", "inflammation", "sinus", "mucus", "scar"] },
    { name: "Black Walnut (Now Foods)", url: "https://www.amazon.com/dp/B0013OVXP8/?tag=clenzara-20", price: "$12.99", keywords: ["black walnut", "walnut", "hull", "digestive", "fungal", "yeast"] },
    { name: "Activated Charcoal", url: "https://www.amazon.com/dp/B01ABPNX4A/?tag=clenzara-20", price: "$12.99", keywords: ["charcoal", "binder", "detox", "bloating", "gas", "food poisoning", "diarrhea", "bind", "toxin"] },
    { name: "Liver Defense (Milk Thistle)", url: "https://www.amazon.com/dp/B0DTQCHQ8N/?tag=clenzara-20", price: "$14.99", keywords: ["liver", "milk thistle", "detox", "cleanse", "support", "bile"] },
    { name: "NAC + Milk Thistle", url: "https://www.amazon.com/dp/B01L9PF06S/?tag=clenzara-20", price: "$16.99", keywords: ["nac", "glutathione", "antioxidant", "liver", "respiratory", "lung", "mucus"] },
    { name: "Magnesium Glycinate", url: "https://www.amazon.com/dp/B0B4WZ4YJM/?tag=clenzara-20", price: "$19.99", keywords: ["magnesium", "sleep", "bowel", "regular", "constipation", "cramp", "muscle", "calm", "anxiety"] },
    { name: "Probiotics (Dr. Mercola)", url: "https://www.amazon.com/dp/B00JEKYNZA/?tag=clenzara-20", price: "$21.99", keywords: ["probiotic", "probiotics", "flora", "microbiome", "gut health", "digestion", "immune", "after cleanse"] },
    { name: "Bentonite Clay", url: "https://www.amazon.com/dp/B00CHTJN4O/?tag=clenzara-20", price: "$14.99", keywords: ["bentonite", "clay", "binder", "detox", "skin", "mask", "heavy metal"] },
  ];

  const fallbacks = [
    "I'd recommend taking our <a href='/#quiz' style='color:#d4a843'>Wellness Quiz</a> — it'll create a personalized protocol based on your specific symptoms in under 2 minutes.",
    "Great question! The best way to find your match is the <a href='/#quiz' style='color:#d4a843'>Wellness Quiz</a>. It maps your symptoms to the right herbs and phases.",
    "Everyone's journey is different. Take the <a href='/#quiz' style='color:#d4a843'>Wellness Quiz</a> and I'll show you exactly which staples your body needs."
  ];

  function matchProducts(query) {
    const q = query.toLowerCase();
    const matches = products.filter(p => 
      p.keywords.some(k => q.includes(k))
    );
    return matches.slice(0, 3); // max 3 recommendations
  }

  function buildResponse(query) {
    const matches = matchProducts(query);
    if (matches.length === 0) {
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    let html = '<div style="font-size:0.9rem;margin-bottom:0.5rem;">Based on your question, here\'s what I recommend:</div>';
    matches.forEach(p => {
      html += '<div style="background:#f9fbf9;border:1px solid #e0e8e0;border-radius:10px;padding:0.75rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.75rem;">';
      html += '<div style="flex:1;"><div style="font-weight:700;font-size:0.85rem;color:#1a2e1a;">' + p.name + '</div><div style="font-size:0.8rem;color:#6c757d;">' + p.price + '</div></div>';
      html += '<a href="' + p.url + '" target="_blank" style="background:#d4a843;color:#fff;padding:0.4rem 0.8rem;border-radius:20px;text-decoration:none;font-size:0.8rem;font-weight:700;white-space:nowrap;" onclick="gtag(\'event\',\'chat_click\',{event_category:\'chat\',event_label:\'' + p.name + '\'})">Shop →</a>';
      html += '</div>';
    });
    html += '<div style="font-size:0.75rem;color:#6c757d;margin-top:0.25rem;">As an Amazon Associate we earn from qualifying purchases.</div>';
    return html;
  }

  // Build UI
  const css = document.createElement('style');
  css.textContent = `
    #clenzara-chat-btn { position:fixed; bottom:24px; right:24px; width:56px; height:56px; border-radius:50%; background:var(--primary,#2d4f35); color:#fff; border:none; font-size:24px; cursor:pointer; z-index:9999; box-shadow:0 4px 16px rgba(0,0,0,.2); display:flex; align-items:center; justify-content:center; transition:transform .2s; }
    #clenzara-chat-btn:hover { transform:scale(1.08); }
    #clenzara-chat-panel { position:fixed; bottom:92px; right:24px; width:340px; max-height:480px; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,.15); z-index:9998; display:none; flex-direction:column; overflow:hidden; font-family:Inter,sans-serif; }
    #clenzara-chat-panel.open { display:flex; }
    .chat-header { background:var(--primary,#2d4f35); color:#fff; padding:1rem; font-weight:700; font-size:0.95rem; display:flex; align-items:center; gap:0.5rem; }
    .chat-header span { font-size:0.75rem; opacity:.8; font-weight:400; }
    .chat-messages { flex:1; overflow-y:auto; padding:1rem; display:flex; flex-direction:column; gap:0.75rem; max-height:320px; }
    .chat-msg { max-width:85%; padding:0.75rem 1rem; border-radius:12px; font-size:0.85rem; line-height:1.5; }
    .chat-msg.bot { background:#f4f8f4; align-self:flex-start; border-bottom-left-radius:4px; }
    .chat-msg.user { background:var(--primary,#2d4f35); color:#fff; align-self:flex-end; border-bottom-right-radius:4px; }
    .chat-input-row { display:flex; padding:0.75rem; border-top:1px solid #eee; gap:0.5rem; }
    .chat-input-row input { flex:1; border:1px solid #ddd; border-radius:20px; padding:0.6rem 1rem; font-size:0.85rem; outline:none; font-family:Inter,sans-serif; }
    .chat-input-row input:focus { border-color:var(--primary,#2d4f35); }
    .chat-input-row button { background:var(--accent,#d4a843); color:#fff; border:none; border-radius:50%; width:36px; height:36px; cursor:pointer; font-size:1rem; flex-shrink:0; }
    .chat-suggestions { display:flex; flex-wrap:wrap; gap:0.4rem; padding:0.5rem 1rem 0.75rem; }
    .chat-suggestion { background:#f0f7f0; border:1px solid #d0e0d0; border-radius:20px; padding:0.35rem 0.75rem; font-size:0.75rem; cursor:pointer; color:var(--primary,#2d4f35); transition:background .2s; }
    .chat-suggestion:hover { background:#dce8dc; }
    .typing-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#999; margin:0 2px; animation:typingBounce 1.4s infinite; }
    .typing-dot:nth-child(2) { animation-delay:.2s; } .typing-dot:nth-child(3) { animation-delay:.4s; }
    @keyframes typingBounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }
    @media (max-width:420px) { #clenzara-chat-panel { width:calc(100vw-32px); right:16px; bottom:80px; } }
  `;
  document.head.appendChild(css);

  const btn = document.createElement('button');
  btn.id = 'clenzara-chat-btn';
  btn.innerHTML = '💬';
  btn.title = 'Ask the Wellness Coach';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'clenzara-chat-panel';
  panel.innerHTML = `
    <div class="chat-header">🌿 Clenzara Wellness Coach <span>· product recommendations</span></div>
    <div class="chat-suggestions">
      <span class="chat-suggestion">best for bloating?</span>
      <span class="chat-suggestion">help with mucus</span>
      <span class="chat-suggestion">liver support</span>
      <span class="chat-suggestion">what kills parasites?</span>
      <span class="chat-suggestion">sleep and digestion</span>
      <span class="chat-suggestion">after food poisoning</span>
    </div>
    <div class="chat-messages" id="chat-msgs">
      <div class="chat-msg bot">Hi! I'm your Wellness Coach. Ask me about any symptom or wellness goal — I'll recommend the right Traditional Wellness staples for your journey. 🌱</div>
    </div>
    <div class="chat-input-row">
      <input type="text" id="chat-input" placeholder="e.g. What helps with bloating?" />
      <button id="chat-send">➤</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Interactions
  btn.addEventListener('click', () => panel.classList.toggle('open'));

  function sendMessage(text, isUser) {
    const msgs = document.getElementById('chat-msgs');
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (isUser ? 'user' : 'bot');
    div.innerHTML = isUser ? text : buildResponse(text);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping(cb) {
    const msgs = document.getElementById('chat-msgs');
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => { div.remove(); cb(); }, 800 + Math.random() * 600);
  }

  document.getElementById('chat-send').addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    sendMessage(text, true);
    input.value = '';
    showTyping(() => sendMessage(text, false));
  });

  document.getElementById('chat-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('chat-send').click();
  });

  // Suggestion chips
  panel.querySelectorAll('.chat-suggestion').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent;
      sendMessage(text, true);
      showTyping(() => sendMessage(text, false));
    });
  });

  // Close on outside click (optional)
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== btn && panel.classList.contains('open')) {
      // panel.classList.remove('open'); // uncomment to enable
    }
  });

})();
