import { TestBed } from '@angular/core/testing';

import { Prestation } from './prestation.service';

describe('Prestation', () => {
  let service: Prestation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prestation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
