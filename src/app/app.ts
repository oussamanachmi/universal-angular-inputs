import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicInput, SelectOption } from './shared/components/dynamic-input/dynamic-input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, DynamicInput],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private fb = inject(FormBuilder);
  form!: FormGroup;

  genderOptions: SelectOption[] = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' }
  ];

  countryOptions: SelectOption[] = [
    { label: 'France', value: 'FR' },
    { label: 'Belgium', value: 'BE' },
    { label: 'Switzerland', value: 'CH' },
    { label: 'Canada', value: 'CA' }
  ];

  submittedData = signal<Record<string, unknown> | null>(null);

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      age: [null, [Validators.min(18)]],
      gender: ['M'],
      country: ['', Validators.required],
      bio: [''],
      newsletter: [false],
      birthDate: ['']
    });
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (control && control.touched && control.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Invalid email';
      if (control.errors['minlength']) return `Minimum ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['min']) return `You must be at least ${control.errors['min'].min} years old`;
    }
    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      this.submittedData.set(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  reset() {
    this.form.reset({ gender: 'M', newsletter: false });
    this.submittedData.set(null);
  }
}
