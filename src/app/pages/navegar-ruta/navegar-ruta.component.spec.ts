import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegarRutaComponent } from './navegar-ruta.component';

describe('NavegarRutaComponent', () => {
  let component: NavegarRutaComponent;
  let fixture: ComponentFixture<NavegarRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavegarRutaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavegarRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
