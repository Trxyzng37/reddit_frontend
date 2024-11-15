import { TestBed } from '@angular/core/testing';

import { EditorSettingService } from './editor-setting.service';

describe('EditorSettingService', () => {
  let service: EditorSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
