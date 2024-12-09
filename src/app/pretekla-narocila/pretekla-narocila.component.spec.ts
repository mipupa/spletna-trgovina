import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreteklaNarocilaComponent } from './pretekla-narocila.component';

describe('PreteklaNarocilaComponent', () => {
  let component: PreteklaNarocilaComponent;
  let fixture: ComponentFixture<PreteklaNarocilaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreteklaNarocilaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreteklaNarocilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
