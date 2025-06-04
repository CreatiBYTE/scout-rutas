import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegarRutaComponent } from './navegar-ruta.component';
import { RutasService } from '../../services/rutas.service';
import { of } from 'rxjs';

describe('NavegarRutaComponent', () => {
  let component: NavegarRutaComponent;
  let fixture: ComponentFixture<NavegarRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavegarRutaComponent],
      providers: [
        { provide: RutasService, useValue: { obtenerRutaPorId: () => of(null) } }
      ]
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
