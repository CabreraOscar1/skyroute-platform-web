import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should use English by default and persist language changes', () => {
    const service = TestBed.inject(LanguageService);

    expect(service.language()).toBe('en');
    expect(service.text().search).toBe('Search');

    service.setLanguage('es');

    expect(service.language()).toBe('es');
    expect(service.text().search).toBe('Buscar');
    expect(localStorage.getItem('skyroute-language')).toBe('es');
  });
});
