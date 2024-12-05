import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoslovalniceComponent } from './poslovalnice.component';

describe('PoslovalniceComponent', () => {
  let component: PoslovalniceComponent;
  let fixture: ComponentFixture<PoslovalniceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoslovalniceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoslovalniceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
