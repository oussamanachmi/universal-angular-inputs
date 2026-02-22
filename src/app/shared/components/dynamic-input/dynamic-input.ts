import { Component, input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

@Component({
  selector: 'on-dynamic-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-input.html',
  styleUrl: './dynamic-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInput),
      multi: true
    }
  ]
})
export class DynamicInput implements ControlValueAccessor {
  // Inputs using Signals
  label = input<string>('');
  type = input<InputType>('text');
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);
  id = input<string>(`input-${Math.random().toString(36).substring(2, 9)}`);
  error = input<string | null>(null);
  hint = input<string>('');
  name = input<string>('');

  // Internal state
  value = signal<unknown>(null);
  disabled = signal<boolean>(false);
  touched = signal<boolean>(false);

  // Callbacks for CVA
  onChange: (value: unknown) => void = () => {
    // Default callback
  };
  onTouched: () => void = () => {
    // Default callback
  };

  // Computed properties
  isInvalid = computed(() => this.touched() && !!this.error());

  // ControlValueAccessor methods
  writeValue(val: unknown): void {
    this.value.set(val);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Event handlers
  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    let val: unknown;

    if (this.type() === 'checkbox') {
      val = (target as HTMLInputElement).checked;
    } else if (this.type() === 'number') {
      val = target.value ? Number(target.value) : null;
    } else {
      val = target.value;
    }

    this.value.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
