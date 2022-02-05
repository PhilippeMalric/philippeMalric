import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonneesQuebecComponent } from './donnees-quebec.component';

describe('RacineComponent', () => {
  let component: DonneesQuebecComponent;
  let fixture: ComponentFixture<DonneesQuebecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonneesQuebecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonneesQuebecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
