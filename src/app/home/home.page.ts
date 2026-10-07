import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
  IonList, IonItem, IonLabel, IonButton, IonInput,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonText, IonNote, // Añadidos aquí también para que el array de abajo los reconozca
  ToastController
} from '@ionic/angular/standalone';
// DONE TA05 – Formularios reactivos: Añadido FormBuilder a los imports, siguiendo sección 9 de apuntes
// FormGroup agrupa los FormControl del formulario.
// FormControl representa cada campo individual.
// ReactiveFormsModule habilita las directivas [formGroup] y formControlName en el HTML.
// FormBuilder (añadido en los imports) es un servicio auxiliar que simplifica la creación de FormGroup y FormControl
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Elemento } from '../models/elemento.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
    IonList, IonItem, IonLabel, IonButton, IonInput,
    // DONE TA05 - Añadimos los componentes Ionic necesarios para el formulario:
    // IonText para envolver o formatear texto dentro del formulario, e
    // IonNote para mostrar los mensajes de validación o error (por ejemplo con color="danger")
    IonText, IonNote,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    // ESTABA DONE TA05 – Añadimos ReactiveFormsModule para habilitar [formGroup] y formControlName
    ReactiveFormsModule
  ],
})

export class HomePage {

  busqueda = signal<string>('');

  elementos = signal<Elemento[]>([
    { id: 1, nombre: 'Angular', descripcion: 'Framework SPA de Google', categoria: 'Frontend' },
    { id: 2, nombre: 'Ionic', descripcion: 'Framework para apps híbridas', categoria: 'Mobile' },
    { id: 3, nombre: 'TypeScript', descripcion: 'Superset tipado de JavaScript', categoria: 'Lenguaje' },
    { id: 4, nombre: 'Node.js', descripcion: 'Entorno de ejecución de JS en servidor', categoria: 'Backend' },
    { id: 5, nombre: 'Capacitor', descripcion: 'Puente nativo para apps Ionic', categoria: 'Mobile' },
  ]);


  hayElementos = computed<boolean>(() => this.elementos().length > 0);

  elementosFiltrados = computed<Elemento[]>(() => {
    const texto = this.busqueda().trim().toLowerCase();
    if (!texto) {
      return this.elementos();
    }

    return this.elementos().filter(e =>
      e.nombre.toLowerCase().includes(texto)
    );
  });

  private router = inject(Router);
  private toastController = inject(ToastController);
  // Injectamos FormBuilder para simplificar la creación del formulario reactivo (MEJORA SUGERIDA EN EL ENUNCIADO)
  private fb = inject(FormBuilder);

  // Creamos el formulario reactivo con FormBuilder (MEJORA SUGERIDA EN EL ENUNCIADO),
  // en lugar de con FormGroup y FormControl e instanciando cada FormControl con 'new' 
  // como en la plantilla del ejericicio:
  //
  //    formulario = new FormGroup({
  //      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //      descripcion: new FormControl('', [Validators.required, Validators.minLength(5)]),
  //      categoria: new FormControl('', [Validators.required, Validators.minLength(3)])
  //    });

  formulario = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        descripcion: ['', [Validators.required, Validators.minLength(5)]],
        categoria: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor() {}

  agregarElemento(): void {
    if (this.formulario.invalid) {
      Object.values(this.formulario.controls).forEach(control => control.markAllAsTouched());
      return;
    }

    const {
      nombre = '',
      descripcion = '',
      categoria = ''
    } = this.formulario.value as {
      nombre?: string | null;
      descripcion?: string | null;
      categoria?: string | null;
    };

    const nuevoElemento: Elemento = {
      id: Date.now(),
      nombre: (nombre ?? '').trim(),
      descripcion: (descripcion ?? '').trim(),
      categoria: (categoria ?? '').trim()
    };

    this.elementos.update((elementosActuales) => [...elementosActuales, nuevoElemento]);
    this.formulario.reset();
  }


  verDetalle(elementoHome: Elemento): void {
    this.router.navigate(['/detalle'], { state: { elementoHome } });
  }


  async mostrarToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Lista de tecnologías cargada correctamente',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
