import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirebaseTestComponent } from './firebase-test.component';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';


// Simple Firestore emulator config for unit test; uses memory to avoid network

describe('FirebaseTestComponent', () => {
  let component: FirebaseTestComponent;
  let fixture: ComponentFixture<FirebaseTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebaseTestComponent],
      providers: [
        provideFirebaseApp(() => {
          const app = initializeApp(environment.firebaseConfig);
          return app;
        }),
        provideFirestore(() => {
          const firestore = getFirestore();
          connectFirestoreEmulator(firestore, 'localhost', 8080);
          return firestore;
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FirebaseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
