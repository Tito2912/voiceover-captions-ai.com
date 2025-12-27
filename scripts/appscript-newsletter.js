// ==========================================================================
// Google Apps Script - Newsletter Subscription Web App
// ==========================================================================

// Configuration
const CONFIG = {
  spreadsheetId: 'YOUR_SPREADSHEET_ID_HERE', // À remplacer par l'ID de votre Google Sheet
  sheetName: 'Newsletter Subscriptions',
  rateLimit: {
    maxRequests: 100,
    timeWindow: 60 // en secondes
  },
  allowedDomains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'],
  bannedDomains: ['temp-mail.org', 'mailinator.com', 'guerrillamail.com', '10minutemail.com']
};

// ==========================================================================
// Fonction principale doPost - Point d'entrée du Web App
// ==========================================================================

function doPost(e) {
  try {
    // Vérifier la méthode HTTP
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse(400, { error: 'Données de requête invalides' });
    }
    
    // Parse les données JSON
    const data = JSON.parse(e.postData.contents);
    
    // Valider les données d'entrée
    const validation = validateInput(data);
    if (!validation.valid) {
      return createResponse(400, { error: validation.message });
    }
    
    // Vérifier le rate limiting
    if (!checkRateLimit(data.email)) {
      return createResponse(429, { error: 'Trop de requêtes. Veuillez réessayer plus tard.' });
    }
    
    // Vérifier le domaine email
    const domainCheck = checkEmailDomain(data.email);
    if (!domainCheck.allowed) {
      return createResponse(400, { error: domainCheck.message });
    }
    
    // Vérifier si l'email existe déjà
    if (isEmailAlreadySubscribed(data.email)) {
      return createResponse(409, { error: 'Cet email est déjà inscrit à la newsletter' });
    }
    
    // Préparer les données pour la feuille de calcul
    const rowData = prepareSpreadsheetData(data);
    
    // Ajouter à Google Sheets
    const result = appendToSpreadsheet(rowData);
    
    // Envoyer un email de confirmation (optionnel)
    if (result.success) {
      sendConfirmationEmail(data.email, data.lang);
    }
    
    // Réponse de succès
    return createResponse(200, { 
      success: true, 
      message: 'Inscription réussie à la newsletter',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // Log l'erreur pour le débogage
    console.error('Error in doPost:', error);
    
    // Réponse d'erreur générique
    return createResponse(500, { 
      error: 'Erreur interne du serveur. Veuillez réessayer plus tard.' 
    });
  }
}

// ==========================================================================
// Fonction doGet pour la vérification et le debugging
// ==========================================================================

function doGet(e) {
  // Endpoint de santé pour vérifier que le script fonctionne
  if (e.parameter.health) {
    return ContentService.createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT)
      .setStatusCode(200);
  }
  
  // Retourner des informations sur le script
  return createResponse(200, {
    service: 'Newsletter Subscription API',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: '/exec - Soumission newsletter',
      GET: '/exec?health=1 - Health check'
    }
  });
}

// ==========================================================================
// Validation des données d'entrée
// ==========================================================================

function validateInput(data) {
  // Vérifier la présence des champs obligatoires
  if (!data.email) {
    return { valid: false, message: 'Email requis' };
  }
  
  // Validation basique de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, message: 'Format email invalide' };
  }
  
  // Vérifier la longueur de l'email
  if (data.email.length > 254) {
    return { valid: false, message: 'Email trop long' };
  }
  
  // Vérifier le honeypot (champ website)
  if (data.website && data.website.trim() !== '') {
    return { valid: false, message: 'Soumission rejetée' };
  }
  
  // Validation optionnelle des autres champs
  if (data.lang && !['en', 'fr'].includes(data.lang)) {
    return { valid: false, message: 'Langue non supportée' };
  }
  
  return { valid: true, message: 'Validation réussie' };
}

// ==========================================================================
// Vérification du domaine email
// ==========================================================================

function checkEmailDomain(email) {
  const domain = email.split('@')[1].toLowerCase();
  
  // Vérifier les domaines bannis
  if (CONFIG.bannedDomains.includes(domain)) {
    return { 
      allowed: false, 
      message: 'Les emails temporaires ne sont pas autorisés' 
    };
  }
  
  // Vérifier les domaines autorisés (optionnel)
  if (CONFIG.allowedDomains.length > 0 && !CONFIG.allowedDomains.includes(domain)) {
    return { 
      allowed: false, 
      message: 'Domaine email non autorisé' 
    };
  }
  
  return { allowed: true, message: 'Domaine valide' };
}

// ==========================================================================
// Rate limiting simple
// ==========================================================================

function checkRateLimit(email) {
  const cache = CacheService.getScriptCache();
  const key = 'rate_limit_' + email.toLowerCase();
  const requests = parseInt(cache.get(key)) || 0;
  
  if (requests >= CONFIG.rateLimit.maxRequests) {
    return false;
  }
  
  cache.put(key, (requests + 1).toString(), CONFIG.rateLimit.timeWindow);
  return true;
}

// ==========================================================================
// Vérification des doublons
// ==========================================================================

function isEmailAlreadySubscribed(email) {
  try {
    const sheet = getSpreadsheet().getSheetByName(CONFIG.sheetName);
    if (!sheet) return false;
    
    const data = sheet.getDataRange().getValues();
    const emailColumn = 1; // Colonne A - email
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailColumn] && data[i][emailColumn].toLowerCase() === email.toLowerCase()) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking duplicate email:', error);
    return false; // En cas d'erreur, on laisse passer pour ne pas bloquer les inscriptions
  }
}

// ==========================================================================
// Préparation des données pour Google Sheets
// ==========================================================================

function prepareSpreadsheetData(data) {
  const timestamp = new Date();
  
  return [
    timestamp.toISOString(),                    // Timestamp
    data.email.toLowerCase(),                   // Email (normalisé)
    data.page || 'unknown',                     // Page source
    data.lang || 'en',                          // Langue
    data.utm_source || 'direct',                // Source UTM
    data.consent || false,                      // Consentement analytics
    timestamp.toLocaleDateString('fr-FR'),      // Date formatée
    timestamp.toLocaleTimeString('fr-FR'),      // Heure formatée
    JSON.stringify(data)                        // Données brutes (pour debug)
  ];
}

// ==========================================================================
// Ajout à Google Sheets
// ==========================================================================

function appendToSpreadsheet(rowData) {
  try {
    const sheet = getSpreadsheet().getSheetByName(CONFIG.sheetName);
    
    // Créer la feuille si elle n'existe pas
    if (!sheet) {
      return createNewSheet(rowData);
    }
    
    // Ajouter la nouvelle ligne
    sheet.appendRow(rowData);
    
    // Appliquer le formatage si nécessaire
    formatNewRow(sheet, sheet.getLastRow());
    
    return { success: true, message: 'Données ajoutées avec succès' };
  } catch (error) {
    console.error('Error appending to spreadsheet:', error);
    return { success: false, message: error.toString() };
  }
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.spreadsheetId);
}

function createNewSheet(rowData) {
  const spreadsheet = getSpreadsheet();
  const sheet = spreadsheet.insertSheet(CONFIG.sheetName);
  
  // En-têtes de colonnes
  const headers = [
    'Timestamp',
    'Email',
    'Page',
    'Language',
    'UTM Source',
    'Analytics Consent',
    'Date',
    'Time',
    'Raw Data'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.appendRow(rowData);
  
  // Formatage de la feuille
  formatSheet(sheet);
  
  return { success: true, message: 'Nouvelle feuille créée' };
}

function formatSheet(sheet) {
  // Largeur des colonnes
  sheet.setColumnWidth(1, 180); // Timestamp
  sheet.setColumnWidth(2, 200); // Email
  sheet.setColumnWidth(3, 120); // Page
  sheet.setColumnWidth(4, 80);  // Language
  sheet.setColumnWidth(5, 120); // UTM Source
  sheet.setColumnWidth(6, 100); // Analytics Consent
  sheet.setColumnWidth(7, 100); // Date
  sheet.setColumnWidth(8, 100); // Time
  sheet.setColumnWidth(9, 300); // Raw Data
  
  // Formatage de l'en-tête
  const headerRange = sheet.getRange(1, 1, 1, 9);
  headerRange.setBackground('#4a86e8')
            .setFontColor('white')
            .setFontWeight('bold');
  
  // Gel de la première ligne (en-tête)
  sheet.setFrozenRows(1);
}

function formatNewRow(sheet, rowNumber) {
  const rowRange = sheet.getRange(rowNumber, 1, 1, 9);
  
  // Alternance des couleurs de ligne
  if (rowNumber % 2 === 0) {
    rowRange.setBackground('#f9f9f9');
  }
  
  // Formatage de la date et heure
  sheet.getRange(rowNumber, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.getRange(rowNumber, 7).setNumberFormat('dd/mm/yyyy');
  sheet.getRange(rowNumber, 8).setNumberFormat('hh:mm:ss');
}

// ==========================================================================
// Email de confirmation (optionnel)
// ==========================================================================

function sendConfirmationEmail(email, lang) {
  try {
    const subject = lang === 'fr' 
      ? 'Confirmation de votre inscription à notre newsletter' 
      : 'Confirmation of your newsletter subscription';
    
    const body = lang === 'fr' 
      ? `Bonjour,\n\nMerci de vous être inscrit à notre newsletter. Vous recevrez prochainement nos dernières actualités sur ElevenLabs Studio 3.0 et les technologies de voix IA.\n\nCordialement,\nL'équipe Voiceover Captions AI`
      : `Hello,\n\nThank you for subscribing to our newsletter. You will receive our latest updates about ElevenLabs Studio 3.0 and AI voice technologies.\n\nBest regards,\nThe Voiceover Captions AI team`;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      noReply: true
    });
    
    console.log('Confirmation email sent to:', email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Ne pas échouer la requête principale à cause de l'email
  }
}

// ==========================================================================
// Utilitaires de réponse HTTP
// ==========================================================================

function createResponse(statusCode, data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  output.setStatusCode(statusCode);
  return output;
}

// ==========================================================================
// Fonctions d'administration et de maintenance
// ==========================================================================

function getSubscriptionCount() {
  const sheet = getSpreadsheet().getSheetByName(CONFIG.sheetName);
  if (!sheet) return 0;
  return sheet.getLastRow() - 1; // Soustraire l'en-tête
}

function exportSubscriptions() {
  const sheet = getSpreadsheet().getSheetByName(CONFIG.sheetName);
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const subscriptions = [];
  
  for (let i = 1; i < data.length; i++) {
    const subscription = {};
    headers.forEach((header, index) => {
      subscription[header] = data[i][index];
    });
    subscriptions.push(subscription);
  }
  
  return subscriptions;
}

function clearOldSubscriptions(days = 365) {
  const sheet = getSpreadsheet().getSheetByName(CONFIG.sheetName);
  if (!sheet) return { deleted: 0 };
  
  const data = sheet.getDataRange().getValues();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  let deletedCount = 0;
  const rowsToKeep = [data[0]]; // Garder l'en-tête
  
  for (let i = 1; i < data.length; i++) {
    const rowDate = new Date(data[i][0]);
    if (rowDate >= cutoffDate) {
      rowsToKeep.push(data[i]);
    } else {
      deletedCount++;
    }
  }
  
  // Réécrire toutes les données
  sheet.clear();
  sheet.getRange(1, 1, rowsToKeep.length, rowsToKeep[0].length).setValues(rowsToKeep);
  
  return { deleted: deletedCount };
}

// ==========================================================================
// Instructions de déploiement
// ==========================================================================

/*
INSTRUCTIONS DE DÉPLOIEMENT:

1. Créer un nouveau Google Sheet et noter son ID dans l'URL
2. Remplacer 'YOUR_SPREADSHEET_ID_HERE' par l'ID réel
3. Créer un nouveau script Google Apps Script (script.google.com)
4. Copier-coller ce code dans l'éditeur
5. Déployer comme application web:
   - Exécution: Moi-même
   - Accès: Toute personne, même anonyme
6. Autoriser les permissions requises
7. Copier l'URL de déploiement pour l'utiliser dans le formulaire

COLONNES ATTENDUES DANS LE GOOGLE SHEET:
1. Timestamp
2. Email
3. Page
4. Language
5. UTM Source
6. Analytics Consent
7. Date
8. Time
9. Raw Data
*/

// ==========================================================================
// Fin du script
// ==========================================================================