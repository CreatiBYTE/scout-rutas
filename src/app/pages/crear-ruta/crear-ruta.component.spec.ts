import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRutaComponent } from './crear-ruta.component';
import { RutasService } from '../../services/rutas.service';
import { of } from 'rxjs';

describe('CrearRutaComponent', () => {
  let component: CrearRutaComponent;
  let fixture: ComponentFixture<CrearRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearRutaComponent],
      providers: [
        { provide: RutasService, useValue: { agregarRuta: () => Promise.resolve() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
