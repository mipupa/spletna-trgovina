import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrgovinaComponent } from './trgovina.component';

describe('TrgovinaComponent', () => {
  let component: TrgovinaComponent;
  let fixture: ComponentFixture<TrgovinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrgovinaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrgovinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
