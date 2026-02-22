import { render, screen, fireEvent } from '@testing-library/angular';
import { DynamicInput } from './dynamic-input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  template: `<on-dynamic-input [formControl]="control" label="Test Label"></on-dynamic-input>`,
  imports: [DynamicInput, ReactiveFormsModule]
})
class TestHostComponent {
  control = new FormControl('');
}

describe('DynamicInput', () => {
  it('should render label', async () => {
    await render(TestHostComponent);
    expect(screen.getByText('Test Label')).toBeTruthy();
  });

  it('should update value on input', async () => {
    const { fixture } = await render(TestHostComponent);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.input(input, { target: { value: 'Hello' } });

    const component = fixture.componentInstance as TestHostComponent;
    expect(component.control.value).toBe('Hello');
  });

  it('should show error message when invalid and touched', async () => {
    @Component({
      template: `<on-dynamic-input [formControl]="control" label="Email" error="Invalid email"></on-dynamic-input>`,
      imports: [DynamicInput, ReactiveFormsModule]
    })
    class ErrorHostComponent {
      control = new FormControl('');
    }

    const { fixture } = await render(ErrorHostComponent);
    const input = screen.getByRole('textbox');

    // Initially no error
    expect(screen.queryByText('Invalid email')).toBeNull();

    // Touch the input
    fireEvent.blur(input);
    fixture.detectChanges();

    expect(screen.getByText('Invalid email')).toBeTruthy();
    expect(input.classList.contains('is-invalid')).toBe(true);
  });
});
