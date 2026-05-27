var SHEET_NAME = 'Waitlist';
// ⚠️ IMPORTANT: Replace with your actual email address before deploying!
var NOTIFICATION_EMAIL = 'YOUR_EMAIL@HERE.COM'; // <--- UPDATE THIS BEFORE DEPLOYMENT

// 1. RUN THIS FUNCTION MANUALLY TO FIX PERMISSIONS
function manualTestAndAuthorize() {
  var testEmail = Session.getActiveUser().getEmail();
  
  // This triggers the Google Authorization popup
  MailApp.sendEmail(testEmail, 
    "Clenzara Auth Test", 
    "If you see this, your script is now authorized to send emails! 💚"
  );
  
  Logger.log("Test email sent to: " + testEmail);
  Logger.log("If you didn't get an error, your website will now send emails correctly.");
}

// 2. THE MAIN WEB APP LOGIC (Don't run this manually)
function doPost(e) {
  var sheet = getSheet();
  var email = "";
  var name = "";
  var utm_source = "direct";
  var utm_medium = "";
  var utm_campaign = "";
  
  try {
    if (e && e.postData && e.postData.contents) {
      var data = JSON.parse(e.postData.contents);
      email = data.email;
      name = data.name || "";
      utm_source = data.utm_source || data.source || "direct";
      utm_medium = data.utm_medium || "";
      utm_campaign = data.utm_campaign || "";
    } else if (e && e.parameter) {
      email = e.parameter.email;
      name = e.parameter.name || "";
      utm_source = e.parameter.utm_source || e.parameter.source || "direct";
      utm_medium = e.parameter.utm_medium || "";
      utm_campaign = e.parameter.utm_campaign || "";
    }

    if (!email) return;

    // Log to Sheet: [Email, Name, Source, Medium, Campaign, Timestamp]
    sheet.appendRow([email, name, utm_source, utm_medium, utm_campaign, new Date().toISOString()]);
    
    // Send Welcome Email
    var welcomeBody = (name ? 'Hey ' + name + ',\n\n' : 'Hey there,\n\n') +
      'Welcome! I\'m so glad you joined the Clenzara Pro waitlist.\n\n' +
      'You\'re here because you want to feel better—maybe you\'re dealing with bloating, fatigue, brain fog, or just don\'t feel like yourself anymore. And you\'re starting to wonder if something deeper is going on.\n\n' +
      'Here\'s the truth: You\'re not imagining it. And you\'re definitely not alone.\n\n' +
      'Before starting any cleanse, the most important first step is opening your drainage pathways. This ensures your body can properly eliminate toxins and minimizes uncomfortable die-off symptoms.\n\n' +
      '👉 Start Here: Opening Your Drainage Pathways (Essential Guide): https://clenzara.com/blog/drainage-pathways\n\n' +
      'Got questions? Reply to this email—we read every single one.\n\n' +
      'To your health,\n' +
      'The Clenzara Team 💚\n\n' +
      '---\n' +
      'Disclaimer: We are not doctors. Consult a healthcare professional before starting any cleanse.';

    MailApp.sendEmail(email, 
      'Welcome to Clenzara — Your gut health journey starts here 💚', 
      welcomeBody
    );
    
    // Notify Owner
    if (NOTIFICATION_EMAIL.includes('@')) {
      MailApp.sendEmail(NOTIFICATION_EMAIL, "New Clenzara Signup: " + email, "User: " + email + "\nName: " + name + "\nSource: " + utm_source + " / " + utm_medium + " / " + utm_campaign);
    }
  } catch (err) {
    Logger.log(err.toString());
  }
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Email', 'Name', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Timestamp']);
  }
  return sheet;
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: 'ok', message: 'API Active'}))
    .setMimeType(ContentService.MimeType.JSON);
}
