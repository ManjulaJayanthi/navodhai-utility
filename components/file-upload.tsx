import { UploadCloud } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  accept?: Record<string, string[]>;
}

export function FileUpload({
  onFileUpload,
  accept = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
    'text/csv': ['.csv'],
  },
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          alert('File size too large. Please upload a file smaller than 10MB');
          return;
        }
        onFileUpload(file);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed p-8 hover:border-primary/50 transition-colors cursor-pointer',
        isDragging && 'border-primary/50 bg-primary/5'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <UploadCloud className="h-8 w-8" />
        <p>Drag & drop your Excel file here, or click to select</p>
        <p className="text-sm">Supports .xlsx and .csv files up to 10MB</p>
      </div>
    </Card>
  );
}
