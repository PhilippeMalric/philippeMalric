import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsViewerComponent } from './items-viewer.component';

describe('ItemsViewerComponent', () => {
  let component: ItemsViewerComponent;
  let fixture: ComponentFixture<ItemsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
