import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaComponent } from './mapa.component';
import { RutasService } from '../../services/rutas.service';
import { of } from 'rxjs';

describe('MapaComponent', () => {
  let component: MapaComponent;
  let fixture: ComponentFixture<MapaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaComponent],
      providers: [
        { provide: RutasService, useValue: { agregarRuta: () => Promise.resolve() } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
