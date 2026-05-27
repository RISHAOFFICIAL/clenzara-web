/**
 * ═══════════════════════════════════════════════════════════════════════
 * Clenzara — Re-Engagement Email Campaign (Google Apps Script)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * The Gut Health Awareness Series — 3-Email Sequence
 *
 * DEPLOYMENT:
 *   1. Open your Waitlist Google Sheet → Extensions → Apps Script
 *   2. Paste this entire file (or merge with your existing waitlist.gs)
 *   3. ⚠️ UPDATE CONFIG: set OWNER_EMAIL, SENDER_NAME, SCHEDULE
 *   4. Run manualTestAndAuthorize() first to grant MailApp permissions
 *   5. To send: Run sendReEngagementEmail1() → sendReEngagementEmail2() etc.
 *
 * EMAIL LIST:
 *   Import re_engagement_recipients.csv into a sheet tab named "ReEngagement"
 *   with columns: Email | EventName | Sent1 | Sent2 | Sent3
 *
 * COMPLIANCE:
 *   - CAN-SPAM: physical address, unsubscribe link in every email
 *   - UTM tracking on all links
 *   - Batch sending (Gmail limit: ~100/day for free accounts, ~1500 for Workspace)
 *
 * @version 1.0
 */

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION — Edit these before deploying
// ═══════════════════════════════════════════════════════════════════════

var CONFIG = {
  // REQUIRED: Your email for owner notifications
  OWNER_EMAIL: 'YOUR_EMAIL@HERE.COM',  // <--- UPDATE THIS
  
  // Sheet names
  WAITLIST_SHEET: 'Waitlist',           // Incoming waitlist signups
  REENGAGEMENT_SHEET: 'ReEngagement',   // Imported re-engagement recipients
  
  // Sender identity
  SENDER_NAME: 'The Clenzara Team',
  
  // Physical address (CAN-SPAM requirement)
  PHYSICAL_ADDRESS: 'Clenzara, PO Box 1234, [City, State ZIP]',  // <--- UPDATE THIS
  
  // Unsubscribe URL (update when live)
  UNSUBSCRIBE_URL: 'https://clenzara.com/unsubscribe',
  
  // Blog URLs
  BLOG_17_SIGNS: 'https://clenzara.com/blog/17-signs-of-parasites-in-humans.html',
  WAITLIST_URL: 'https://clenzara.com/#waitlist',
  
  // Batch size per send (Gmail: free accounts ~100/day, Workspace ~1500/day)
  BATCH_SIZE: 50,
  
  // Delay between individual emails (milliseconds) to avoid rate limits
  EMAIL_DELAY_MS: 500,
};

// ═══════════════════════════════════════════════════════════════════════
// EMAIL TEMPLATES — From re_engagement_sequence.md
// ═══════════════════════════════════════════════════════════════════════

/**
 * Email 1: The Eye-Opener
 * Goal: Introduce Clenzara + hook with free guide
 * CTA: Read "17 Signs" guide
 * UTM: utm_source=email&utm_medium=list&utm_campaign=reengagement1
 */
function buildEmail1(firstName, eventName) {
  var greeting = firstName ? 'Hey ' + firstName : 'Hey there';
  
  var personalNote = '';
  if (eventName) {
    var ctx = getEventContext(eventName);
    if (ctx) {
      personalNote = '\n' + ctx + '\n\n';
    }
  }
  
  var subject = 'Something you might not know about your health...';
  
  var body = greeting + ' 👋\n\n' +
    'I\'ve been working on something new, and I thought of you.' +
    personalNote +
    'It\'s called **Clenzara** — a resource dedicated to gut health, parasite cleansing, and natural wellness.\n\n' +
    'Before I share more about what we\'re building, I wanted to give you something valuable first.\n\n' +
    '👉 Free Guide: "17 Signs You Might Have Parasites"\n\n' +
    'If you\'ve been dealing with any of these:\n' +
    '• Constant fatigue that doesn\'t go away with sleep\n' +
    '• Bloating, gas, or digestive issues\n' +
    '• Sugar cravings that feel impossible to beat\n' +
    '• Skin problems with no clear cause\n' +
    '• Brain fog or difficulty concentrating\n\n' +
    '...you might want to read this.\n\n' +
    'Up to 80% of people may have some form of parasitic infection without knowing it. ' +
    'The symptoms often get misdiagnosed — or blamed on "just getting older" or "stress."\n\n' +
    'I put together a free guide that breaks down the 17 most common signs, what to do about them, ' +
    'and which supplements actually help.\n\n' +
    '👉 Read the Free Guide:\n' +
    CONFIG.BLOG_17_SIGNS + '?utm_source=email&utm_medium=list&utm_campaign=reengagement1\n\n' +
    'No catch. Just genuinely useful information.\n\n' +
    'More soon,\n\n' +
    CONFIG.SENDER_NAME + ' 💚\n\n' +
    '---\n' +
    CONFIG.PHYSICAL_ADDRESS + '\n' +
    'If you\'d like to stop receiving emails, you can unsubscribe here: ' + CONFIG.UNSUBSCRIBE_URL + '\n' +
    'Disclaimer: Educational content only — not medical advice. Always consult a healthcare provider.';
  
  return { subject: subject, body: body };
}

/**
 * Email 2: The Deeper Dive + Waitlist Intro
 * Goal: Deepen education + introduce Pro App
 * CTA: Join waitlist (soft ask)
 * UTM: utm_source=email&utm_medium=list&utm_campaign=reengagement2
 */
function buildEmail2(firstName) {
  var greeting = firstName ? 'Hey ' + firstName : 'Hey there';
  
  var subject = 'The science behind why you feel this way';
  
  var body = greeting + ' 👋\n\n' +
    'Last email, I shared the "17 Signs" guide — did you get a chance to check it out?\n\n' +
    'If you did, great! If not, you can still access it here:\n\n' +
    '📖 17 Signs You Might Have Parasites:\n' +
    CONFIG.BLOG_17_SIGNS + '?utm_source=email&utm_medium=list&utm_campaign=reengagement2\n\n' +
    'Today I want to give you a little more context on *why* these symptoms happen.\n\n' +
    'Here\'s what science tells us:\n\n' +
    'When parasites take up residence in your gut, they do three things:\n\n' +
    '1. **Feed on your nutrients** — leaving you fatigued and depleted\n' +
    '2. **Release toxins** — that your body has to work overtime to process\n' +
    '3. **Disrupt digestion** — leading to bloating, gas, and irregular bowel movements\n\n' +
    'Sound familiar?\n\n' +
    'The good news: Your body is designed to cleanse itself. With the right support — ' +
    'targeted herbs, proper hydration, and gut-healing nutrients — you can push these ' +
    'uninvited guests out and feel like yourself again.\n\n' +
    'We\'re also building something you might be interested in:\n\n' +
    '**Clenzara Pro** is an app that helps you:\n' +
    '• Track your cleansing journey\n' +
    '• Get personalized supplement protocols\n' +
    '• Monitor symptoms over time\n' +
    '• Access educational content updated weekly\n\n' +
    'It\'s almost ready, and I\'m inviting people like you to get early access.\n\n' +
    '👉 Join the Waitlist:\n' +
    CONFIG.WAITLIST_URL + '?utm_source=email&utm_medium=list&utm_campaign=reengagement2\n\n' +
    'As a thank you, I\'ll send you a free **"Founder\'s Guide to Parasite Cleansing"** PDF ' +
    '— my complete protocol for a 30-day cleanse.\n\n' +
    'More soon,\n\n' +
    CONFIG.SENDER_NAME + ' 💚\n\n' +
    '---\n' +
    CONFIG.PHYSICAL_ADDRESS + '\n' +
    'Unsubscribe: ' + CONFIG.UNSUBSCRIBE_URL + '\n' +
    'Disclaimer: Educational content only — not medical advice.';
  
  return { subject: subject, body: body };
}

/**
 * Email 3: The Offer
 * Goal: Convert to waitlist + PDF lead magnet
 * CTA: Join waitlist (direct)
 * UTM: utm_source=email&utm_medium=list&utm_campaign=reengagement3
 */
function buildEmail3(firstName) {
  var greeting = firstName ? 'Hey ' + firstName : 'Hey there';
  
  var subject = 'A free guide + early access — just for you';
  
  var body = greeting + ' 👋\n\n' +
    'You\'ve been on my list for a while, and I don\'t want to take you for granted.\n\n' +
    'So I want to make you an offer that\'s only available to people like you who\'ve interacted with me before.\n\n' +
    'Here\'s what\'s yours:\n\n' +
    '🎁 **Free Founder\'s Guide to Parasite Cleansing**\n' +
    'A complete 30-day protocol with day-by-day supplement schedule, meal plans, ' +
    'and tips for managing die-off symptoms. Valued at $29, but yours free.\n\n' +
    '✨ **Early Access to Clenzara Pro**\n' +
    'When the app launches, you\'ll be among the first to use it — with founding member ' +
    'pricing that won\'t be available later.\n\n' +
    '**All you have to do:**\n' +
    'Click the link below and join the waitlist. I\'ll send you the PDF immediately, ' +
    'and you\'ll get early access when we launch.\n\n' +
    '👉 Claim Your Free Guide + Waitlist Access:\n' +
    CONFIG.WAITLIST_URL + '?utm_source=email&utm_medium=list&utm_campaign=reengagement3\n\n' +
    'This offer expires in 48 hours.\n\n' +
    'And remember — whether or not you\'re ready to join, I respect your time. ' +
    'But if you\'ve ever been curious about gut health or parasite cleansing, ' +
    'this is the guide I wish I had years ago.\n\n' +
    'Take care of yourself,\n\n' +
    CONFIG.SENDER_NAME + ' 💚\n\n' +
    'P.S. The PDF alone is worth checking out — even if you\'re not sure about the app. ' +
    'Just click the link.\n\n' +
    '---\n' +
    CONFIG.PHYSICAL_ADDRESS + '\n' +
    'Unsubscribe: ' + CONFIG.UNSUBSCRIBE_URL + '\n' +
    'Disclaimer: Educational content only — not medical advice.';
  
  return { subject: subject, body: body };
}

// ═══════════════════════════════════════════════════════════════════════
// PERSONALIZATION HELPERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Map event names to personalized context sentences.
 */
function getEventContext(eventName) {
  var normalized = (eventName || '').toLowerCase().trim();
  
  var contexts = [
    { match: 'valentine', text: 'You\'re someone who cares about the people in your life — and taking care of yourself matters too.' },
    { match: 'birthday',  text: 'You\'ve always shown up for the people you love. This is about showing up for yourself too.' },
    { match: 'game on',   text: 'You\'re someone who likes to be prepared and informed — this guide is right up your alley.' },
    { match: 'limitless', text: 'You\'re clearly someone who takes action on things that matter. This is worth checking out.' },
    { match: 'msu',       text: 'Go green! (Or blue — either way, this is for you.) But seriously — take care of your gut.' },
    { match: 'penske',    text: 'You clearly take your health and performance seriously. This is for people like you.' },
    { match: 'javeon',    text: 'Family and health go hand in hand. This is something for you to feel good about.' },
    { match: 'color',     text: 'You\'re someone who brings energy and color to everything you do. Your health deserves the same.' },
    { match: 'party',     text: 'You know how to have a good time — now it\'s time to take care of the body that gets you there.' },
    { match: 'grad',      text: 'You\'re achieving big things. Don\'t let brain fog or fatigue hold you back.' },
  ];
  
  for (var i = 0; i < contexts.length; i++) {
    if (normalized.indexOf(contexts[i].match) !== -1) {
      return contexts[i].text;
    }
  }
  
  return 'I was thinking of you and wanted to share something that could genuinely help.';
}

// ═══════════════════════════════════════════════════════════════════════
// SHEET OPERATIONS
// ═══════════════════════════════════════════════════════════════════════

function getSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    Logger.log('Created new sheet: ' + sheetName);
  }
  return sheet;
}

function ensureReEngagementHeaders() {
  var sheet = getSheet(CONFIG.REENGAGEMENT_SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Email', 'EventName', 'SentEmail1', 'SentEmail2', 'SentEmail3', 'Timestamp1', 'Timestamp2', 'Timestamp3']);
    Logger.log('Added headers to ReEngagement sheet');
  }
  return sheet;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN SEND FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

/**
 * SEND RE-ENGAGEMENT EMAIL 1 — "The Eye-Opener"
 * Run this manually or via time-driven trigger.
 * 
 * Sends to recipients in ReEngagement sheet where SentEmail1 is empty.
 */
function sendReEngagementEmail1() {
  var sheet = ensureReEngagementHeaders();
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No re-engagement recipients found. Import re_engagement_recipients.csv first.');
    return;
  }
  
  var sent = 0;
  var skipped = 0;
  
  for (var i = 1; i < data.length; i++) {
    if (sent >= CONFIG.BATCH_SIZE) {
      Logger.log('Batch size limit reached (' + CONFIG.BATCH_SIZE + '). Stopping.');
      break;
    }
    
    var email = data[i][0];
    var eventName = data[i][1] || '';
    var alreadySent = data[i][2]; // SentEmail1 column
    
    if (!email || alreadySent) {
      skipped++;
      continue;
    }
    
    var firstName = email.split('@')[0].replace(/[0-9._]/g, '').replace(/^./, function(c) { return c.toUpperCase(); });
    if (firstName.length < 2) firstName = '';
    
    var msg = buildEmail1(firstName, eventName);
    
    try {
      MailApp.sendEmail(email, msg.subject, msg.body);
      
      // Mark as sent
      var row = i + 1;
      sheet.getRange(row, 3).setValue('YES');
      sheet.getRange(row, 6).setValue(new Date().toISOString());
      
      sent++;
      Logger.log('✓ Sent Email 1 to: ' + email);
      
      // Delay to avoid rate limits
      if (sent < CONFIG.BATCH_SIZE) {
        Utilities.sleep(CONFIG.EMAIL_DELAY_MS);
      }
    } catch (err) {
      Logger.log('✗ Failed to send to ' + email + ': ' + err.toString());
    }
  }
  
  Logger.log('Email 1 batch complete: ' + sent + ' sent, ' + skipped + ' skipped');
  
  // Notify owner
  if (CONFIG.OWNER_EMAIL.includes('@')) {
    MailApp.sendEmail(CONFIG.OWNER_EMAIL, 
      'Clenzara Re-Engagement: Email 1 Sent', 
      'Email 1 batch complete.\nSent: ' + sent + '\nSkipped: ' + skipped + '\nRemaining: ' + (data.length - 1 - sent - skipped)
    );
  }
}

/**
 * SEND RE-ENGAGEMENT EMAIL 2 — "The Deeper Dive"
 * Only sends to recipients who received Email 1.
 */
function sendReEngagementEmail2() {
  var sheet = ensureReEngagementHeaders();
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No recipients found.');
    return;
  }
  
  var sent = 0;
  var skipped = 0;
  
  for (var i = 1; i < data.length; i++) {
    if (sent >= CONFIG.BATCH_SIZE) {
      Logger.log('Batch size limit reached.');
      break;
    }
    
    var email = data[i][0];
    var sentEmail1 = data[i][2];
    var alreadySentEmail2 = data[i][3];
    
    if (!email || !sentEmail1 || alreadySentEmail2) {
      skipped++;
      continue;
    }
    
    var firstName = email.split('@')[0].replace(/[0-9._]/g, '').replace(/^./, function(c) { return c.toUpperCase(); });
    if (firstName.length < 2) firstName = '';
    
    var msg = buildEmail2(firstName);
    
    try {
      MailApp.sendEmail(email, msg.subject, msg.body);
      
      var row = i + 1;
      sheet.getRange(row, 4).setValue('YES');
      sheet.getRange(row, 7).setValue(new Date().toISOString());
      
      sent++;
      Logger.log('✓ Sent Email 2 to: ' + email);
      
      if (sent < CONFIG.BATCH_SIZE) {
        Utilities.sleep(CONFIG.EMAIL_DELAY_MS);
      }
    } catch (err) {
      Logger.log('✗ Failed to send to ' + email + ': ' + err.toString());
    }
  }
  
  Logger.log('Email 2 batch complete: ' + sent + ' sent, ' + skipped + ' skipped');
  
  if (CONFIG.OWNER_EMAIL.includes('@')) {
    MailApp.sendEmail(CONFIG.OWNER_EMAIL, 
      'Clenzara Re-Engagement: Email 2 Sent', 
      'Email 2 batch complete.\nSent: ' + sent + '\nSkipped: ' + skipped
    );
  }
}

/**
 * SEND RE-ENGAGEMENT EMAIL 3 — "The Offer"
 * Only sends to recipients who received Email 2.
 */
function sendReEngagementEmail3() {
  var sheet = ensureReEngagementHeaders();
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No recipients found.');
    return;
  }
  
  var sent = 0;
  var skipped = 0;
  
  for (var i = 1; i < data.length; i++) {
    if (sent >= CONFIG.BATCH_SIZE) {
      Logger.log('Batch size limit reached.');
      break;
    }
    
    var email = data[i][0];
    var sentEmail2 = data[i][3];
    var alreadySentEmail3 = data[i][4];
    
    if (!email || !sentEmail2 || alreadySentEmail3) {
      skipped++;
      continue;
    }
    
    var firstName = email.split('@')[0].replace(/[0-9._]/g, '').replace(/^./, function(c) { return c.toUpperCase(); });
    if (firstName.length < 2) firstName = '';
    
    var msg = buildEmail3(firstName);
    
    try {
      MailApp.sendEmail(email, msg.subject, msg.body);
      
      var row = i + 1;
      sheet.getRange(row, 5).setValue('YES');
      sheet.getRange(row, 8).setValue(new Date().toISOString());
      
      sent++;
      Logger.log('✓ Sent Email 3 to: ' + email);
      
      if (sent < CONFIG.BATCH_SIZE) {
        Utilities.sleep(CONFIG.EMAIL_DELAY_MS);
      }
    } catch (err) {
      Logger.log('✗ Failed to send to ' + email + ': ' + err.toString());
    }
  }
  
  Logger.log('Email 3 batch complete: ' + sent + ' sent, ' + skipped + ' skipped');
  
  if (CONFIG.OWNER_EMAIL.includes('@')) {
    MailApp.sendEmail(CONFIG.OWNER_EMAIL, 
      'Clenzara Re-Engagement: Email 3 Sent', 
      'Email 3 batch complete.\nSent: ' + sent + '\nSkipped: ' + skipped + '\n\n🎉 Campaign complete!'
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TESTING & AUTHORIZATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Run this first to authorize MailApp permissions.
 * Sends a test email to confirm MailApp works.
 */
function manualTestAndAuthorize() {
  var testEmail = Session.getActiveUser().getEmail();
  
  MailApp.sendEmail(testEmail, 
    'Clenzara Re-Engagement — Auth Test', 
    'If you see this, the script is authorized to send re-engagement emails! 💚\n\n' +
    'Ready to deploy the 3-email Gut Health Awareness Series.'
  );
  
  Logger.log('✓ Test email sent to: ' + testEmail);
}

/**
 * Send a single test email to verify formatting + links.
 * @param {string} testEmail - Email address to send test to
 */
function sendTestEmail(testEmail) {
  if (!testEmail) {
    testEmail = Session.getActiveUser().getEmail();
  }
  
  // Send Email 1 as a preview
  var msg1 = buildEmail1('TestUser', 'Happy Valentine\'s Day!');
  MailApp.sendEmail(testEmail, '[TEST] ' + msg1.subject, msg1.body);
  
  Utilities.sleep(2000);
  
  // Send Email 2 as a preview
  var msg2 = buildEmail2('TestUser');
  MailApp.sendEmail(testEmail, '[TEST] ' + msg2.subject, msg2.body);
  
  Utilities.sleep(2000);
  
  // Send Email 3 as a preview
  var msg3 = buildEmail3('TestUser');
  MailApp.sendEmail(testEmail, '[TEST] ' + msg3.subject, msg3.body);
  
  Logger.log('✓ All 3 test emails sent to: ' + testEmail);
}

// ═══════════════════════════════════════════════════════════════════════
// IMPORT & DATA HELPERS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Import re_engagement_recipients.csv into the ReEngagement sheet.
 * Paste CSV data starting at cell A1 of the ReEngagement tab.
 * 
 * Manual steps (faster than scripted import):
 *   1. Open re_engagement_recipients.csv in a text editor
 *   2. Select All → Copy
 *   3. In Google Sheets → ReEngagement tab → A1 → Paste
 *   4. Make sure columns match: Email | EventName
 */

/**
 * Get campaign stats from the ReEngagement sheet.
 */
function getReEngagementStats() {
  var sheet = getSheet(CONFIG.REENGAGEMENT_SHEET);
  var data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    Logger.log('No data in ReEngagement sheet.');
    return;
  }
  
  var total = data.length - 1;
  var sent1 = 0, sent2 = 0, sent3 = 0;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][2]) sent1++;
    if (data[i][3]) sent2++;
    if (data[i][4]) sent3++;
  }
  
  var stats = '📊 Re-Engagement Campaign Stats\n' +
    'Total recipients: ' + total + '\n' +
    'Email 1 sent:     ' + sent1 + '\n' +
    'Email 2 sent:     ' + sent2 + '\n' +
    'Email 3 sent:     ' + sent3 + '\n' +
    'Completion rate:  ' + (total > 0 ? Math.round(sent3/total*100) : 0) + '%';
  
  Logger.log(stats);
  
  // Email stats to owner
  if (CONFIG.OWNER_EMAIL.includes('@')) {
    MailApp.sendEmail(CONFIG.OWNER_EMAIL, 'Clenzara Re-Engagement Stats', stats);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// WEB APP ENDPOINTS (for integration with waitlist)
// ═══════════════════════════════════════════════════════════════════════

/**
 * GET handler for testing.
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Clenzara Re-Engagement API Active',
    version: '1.0',
    recipients: getRecipientCount()
  })).setMimeType(ContentService.MimeType.JSON);
}

function getRecipientCount() {
  try {
    var sheet = getSheet(CONFIG.REENGAGEMENT_SHEET);
    return Math.max(0, sheet.getLastRow() - 1);
  } catch (e) {
    return 0;
  }
}

/**
 * POST handler — can receive new subscribers from waitlist form.
 * Merges new waitlist signups into the ReEngagement sheet automatically.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = data.email;
    var name = data.name || '';
    
    if (!email) {
      return ContentService.createTextOutput(JSON.stringify({status: 'error', message: 'Email required'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Also add to ReEngagement sheet for future nurture sequences
    var sheet = getSheet(CONFIG.REENGAGEMENT_SHEET);
    var existingEmails = sheet.getDataRange().getValues();
    var isDuplicate = false;
    
    for (var i = 1; i < existingEmails.length; i++) {
      if (existingEmails[i][0] && existingEmails[i][0].toString().toLowerCase() === email.toLowerCase()) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      sheet.appendRow([email, 'Waitlist Signup']);
      Logger.log('Added ' + email + ' to re-engagement list from waitlist signup');
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: 'ok', message: 'Recipient added'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}