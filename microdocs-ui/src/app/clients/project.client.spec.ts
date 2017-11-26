import { TestBed, inject } from '@angular/core/testing';

import { ProjectClient } from './project.client';

describe('ProjectClient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectClient]
    });
  });

  it('should be created', inject([ProjectClient], (service: ProjectClient) => {
    expect(service).toBeTruthy();
  }));
});
