import { render, screen, fireEvent } from '@testing-library/angular';
import { FileUploadComponent } from './file-upload';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  template: `<app-file-upload [formControl]="control" label="Upload Test"></app-file-upload>`,
  imports: [FileUploadComponent, ReactiveFormsModule]
})
class TestHostComponent {
  control = new FormControl([]);
}

describe('FileUploadComponent', () => {
  it('should render label', async () => {
    await render(TestHostComponent);
    expect(screen.getByText('Upload Test')).toBeTruthy();
  });

  it('should show drop zone', async () => {
    await render(TestHostComponent);
    expect(screen.getByText(/Glissez-déposez vos fichiers ici/)).toBeTruthy();
  });

  it('should have a browse button', async () => {
    await render(TestHostComponent);
    expect(screen.getByText('Parcourir')).toBeTruthy();
  });
});
