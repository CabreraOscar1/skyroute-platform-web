import { Injectable, computed, signal } from '@angular/core';

import { Language, languageOptions, translations } from './translations';

const storageKey = 'skyroute-language';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly selectedLanguage = signal<Language>(this.readStoredLanguage());

  readonly language = this.selectedLanguage.asReadonly();
  readonly options = languageOptions;
  readonly text = computed(() => translations[this.selectedLanguage()]);

  setLanguage(language: Language): void {
    this.selectedLanguage.set(language);
    this.storeLanguage(language);
  }

  private readStoredLanguage(): Language {
    if (typeof localStorage === 'undefined') {
      return 'en';
    }

    const storedLanguage = localStorage.getItem(storageKey);
    return storedLanguage === 'es' ? 'es' : 'en';
  }

  private storeLanguage(language: Language): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, language);
    }
  }
}
