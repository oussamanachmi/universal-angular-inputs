import { Component, input, signal, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUploader, FileUploadModule, FileItem } from 'ng2-file-upload';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data?: string; // base64 for images
  extension: string;
}

@Component({
  selector: 'on-file-upload',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  label = input<string>('Choisir un fichier');
  allowedTypes = input<string[]>([]); // e.g. ['image/png', 'application/pdf']
  maxFileSize = input<number>(10 * 1024 * 1024); // 10MB default

  // Internal state
  uploadedFiles = signal<UploadedFile[]>([]);
  uploader: FileUploader;
  isOverDropZone = signal<boolean>(false);

  onChange: (value: unknown) => void = () => {
    // Default callback
  };
  onTouched: () => void = () => {
    // Default callback
  };

  constructor() {
    this.uploader = new FileUploader({
      url: '', // No actual backend URL for this demo
      disableMultipart: true
    });

    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      const file = fileItem._file;
      const extension = file.name.split('.').pop()?.toLowerCase() || '';

      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        extension: extension
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            newFile.data = e.target.result as string;
            this.uploadedFiles.update(files => [...files, newFile]);
            this.onChange(this.uploadedFiles());
          }
        };
        reader.readAsDataURL(file);
      } else {
        this.uploadedFiles.update(files => [...files, newFile]);
        this.onChange(this.uploadedFiles());
      }
    };
  }

  // ControlValueAccessor
  writeValue(value: unknown): void {
    if (Array.isArray(value)) {
      this.uploadedFiles.set(value as UploadedFile[]);
    } else {
      this.uploadedFiles.set([]);
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  removeFile(index: number): void {
    this.uploadedFiles.update(files => files.filter((_, i) => i !== index));
    this.onChange(this.uploadedFiles());
  }

  getFileIcon(extension: string): string {
    switch (extension) {
      case 'pdf': return 'bi-file-earmark-pdf text-danger';
      case 'doc':
      case 'docx': return 'bi-file-earmark-word text-primary';
      case 'xls':
      case 'xlsx': return 'bi-file-earmark-excel text-success';
      case 'ppt':
      case 'pptx': return 'bi-file-earmark-slides text-warning';
      case 'zip':
      case 'rar': return 'bi-file-earmark-zip text-secondary';
      case 'txt': return 'bi-file-earmark-text text-dark';
      default: return 'bi-file-earmark text-muted';
    }
  }

  isImage(type: string): boolean {
    return type.startsWith('image/');
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
