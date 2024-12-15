import { TestBed } from '@angular/core/testing';

import { KosaricaService } from './kosarica.service';

describe('KosaricaService', () => {
  let service: KosaricaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KosaricaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
