// Load all language files
const languages = {
  en: () => import('../i18n/en.json').then(module => module.default),
  es: () => import('../i18n/es.json').then(module => module.default),
  pt: () => import('../i18n/pt.json').then(module => module.default),
  it: () => import('../i18n/it.json').then(module => module.default),
  fr: () => import('../i18n/fr.json').then(module => module.default),
  de: () => import('../i18n/de.json').then(module => module.default),
};

// Get language from URL or localStorage, fallback to browser preference or 'en'
export function getLanguage() {
  if (typeof window === 'undefined') return 'en';
  
  // First check URL hash for language code
  const hashLang = window.location.hash.substring(1);
  if (hashLang && Object.keys(languages).includes(hashLang)) {
    localStorage.setItem('preferredLanguage', hashLang);
    return hashLang;
  }
  
  // Then check localStorage
  const storedLang = localStorage.getItem('preferredLanguage');
  if (storedLang && Object.keys(languages).includes(storedLang)) {
    return storedLang;
  }
  
  // Then check browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang && Object.keys(languages).includes(browserLang)) {
    return browserLang;
  }
  
  // Default to English
  return 'en';
}

// Cache for loaded translations
const translationsCache = {};

// Load translations for a specific language
export async function loadTranslations(lang = 'en') {
  if (!Object.keys(languages).includes(lang)) {
    lang = 'en'; // Fallback to English
  }
  
  if (!translationsCache[lang]) {
    try {
      translationsCache[lang] = await languages[lang]();
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      return languages.en ? await languages.en() : {};
    }
  }
  
  return translationsCache[lang];
}

// Set the current language and reload the page with translations applied
export function setLanguage(lang) {
  if (typeof window !== 'undefined' && Object.keys(languages).includes(lang)) {
    localStorage.setItem('preferredLanguage', lang);
    window.location.hash = lang;
    
    // Reload the translations without refreshing the page
    loadTranslations(lang).then(translations => {
      document.documentElement.lang = lang;
      
      // Apply translations to all elements with data-i18n* attributes
      applyTranslations(translations);
      
      // Dispatch event that translations have been updated
      document.dispatchEvent(new CustomEvent('translationsLoaded', { detail: { lang } }));
    }).catch(error => {
      console.error('Error changing language:', error);
    });
  }
}

// Helper function to apply translations to all elements
function applyTranslations(translations) {
  // Regular content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const value = getNestedValue(translations, key);
      if (value !== null && typeof value !== 'object') { // Check that the value is not an object
        el.textContent = value;
      } else if (value === null) {
        console.warn(`Translation key not found: ${key}`);
      } else if (typeof value === 'object') {
        console.warn(`Translation key resolves to an object, not a string: ${key}`);
      }
    }
  });
  
  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && el instanceof HTMLElement) {
      const value = getNestedValue(translations, key);
      if (value !== null && typeof value !== 'object' && 'placeholder' in el) {
        el.placeholder = value;
      }
    }
  });
  
  // Titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key && el instanceof HTMLElement) {
      const value = getNestedValue(translations, key);
      if (value !== null && typeof value !== 'object') {
        el.title = value;
      }
    }
  });
  
  // Input values
  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    const key = el.getAttribute('data-i18n-value');
    if (key && el instanceof HTMLInputElement) {
      const value = getNestedValue(translations, key);
      if (value !== null && typeof value !== 'object') {
        el.value = value;
      }
    }
  });
  
  // Aria labels
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (key && el instanceof HTMLElement) {
      const value = getNestedValue(translations, key);
      if (value !== null && typeof value !== 'object') {
        el.setAttribute('aria-label', value);
      }
    }
  });
  
  // Alts for images
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (key && el instanceof HTMLImageElement) {
      const value = getNestedValue(translations, key);
      if (value !== null && typeof value !== 'object') {
        el.alt = value;
      }
    }
  });
  
  // Document title
  if (translations.siteTitle && typeof translations.siteTitle === 'string') {
    document.title = translations.siteTitle;
  }
}

// Helper to get a nested value from an object using a dot-notation string
function getNestedValue(obj, path) {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return null;
    }
  }
  
  return value;
}