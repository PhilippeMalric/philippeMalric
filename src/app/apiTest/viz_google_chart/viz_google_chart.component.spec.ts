import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VizGoogleChartComponent } from './viz_google_chart.component';

describe('VizComponent', () => {
  let component: VizGoogleChartComponent;
  let fixture: ComponentFixture<VizGoogleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VizGoogleChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VizGoogleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
