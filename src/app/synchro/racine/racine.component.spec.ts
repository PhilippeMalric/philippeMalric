import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacineComponent } from './racine.component';

describe('RacineComponent', () => {
  let component: RacineComponent;
  let fixture: ComponentFixture<RacineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RacineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
