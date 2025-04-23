import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from './Form';
import { X, Upload, Paperclip, Image as ImageIcon } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { TRANSITIONS, combineAnimations } from '../utils/animations';
import { useCombinedRefs } from '../hooks/useCombinedRefs';
import IconButton from './IconButton';

// File Upload Field
interface FileFieldProps extends
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
}

export function FileField({
  name,
  label,
  description,
  required,
  maxSize,
  accept,
  multiple,
  onFiles,
  className,
  ...props
}: FileFieldProps) {
  const { register, formState: { errors }, setValue } = useFormContext();
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const error = errors[name]?.message as string | undefined;

  // Register the field with react-hook-form
  const { ref: registerRef, ...registerProps } = register(name);
  const combinedRef = useCombinedRefs<HTMLInputElement>(inputRef, registerRef);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter(file => {
      if (maxSize && file.size > maxSize) {
        showError(`File "${file.name}" exceeds maximum size of ${formatBytes(maxSize)}`);
        return false;
      }
      return true;
    });

    if (!multiple) {
      setFiles(validFiles.slice(0, 1));
      setValue(name, validFiles[0] || null);
    } else {
      setFiles(prev => [...prev, ...validFiles]);
      setValue(name, validFiles);
    }

    onFiles?.(validFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      setValue(name, multiple ? newFiles : (newFiles[0] || null));
      onFiles?.(newFiles);
      return newFiles;
    });

    // Clear input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const showError = (message: string) => {
    // You can integrate this with your toast system
    console.error(message);
  };

  const clearFiles = () => {
    setFiles([]);
    setValue(name, multiple ? [] : null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearFiles();
    };
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className={darkModeClass(
            "block text-sm font-medium",
            "text-gray-700",
            "text-gray-200"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={combineAnimations(
          "relative rounded-lg border-2 border-dashed p-4",
          "transition duration-300 ease-in-out",
          darkModeClass(
            "bg-white dark:bg-gray-800",
            dragActive ? "border-indigo-500" : "border-gray-300",
            dragActive ? "border-indigo-400" : "border-gray-700"
          ),
          error ? "border-red-500" : "",
          className
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <input
          ref={combinedRef}
          type="file"
          id={name}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />

        <div className="text-center">
          <Upload
            className={darkModeClass(
              "mx-auto h-12 w-12",
              "text-gray-400",
              "text-gray-500"
            )}
          />
          
          <div className="mt-4 flex text-sm justify-center">
            <label
              htmlFor={name}
              className={darkModeClass(
                "relative cursor-pointer rounded-md font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2",
                "text-indigo-600 hover:text-indigo-500",
                "text-indigo-400 hover:text-indigo-300"
              )}
            >
              <span>Upload {multiple ? 'files' : 'a file'}</span>
            </label>
            <p className={darkModeClass(
              "pl-1",
              "text-gray-500",
              "text-gray-400"
            )}>
              or drag and drop
            </p>
          </div>

          {description && (
            <p className={darkModeClass(
              "text-xs mt-2",
              "text-gray-500",
              "text-gray-400"
            )}>
              {description}
            </p>
          )}
        </div>

        {files.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Paperclip className="h-5 w-5 text-gray-400" />
                  )}
                  <span className={darkModeClass(
                    "ml-2 text-sm truncate max-w-xs",
                    "text-gray-700",
                    "text-gray-200"
                  )}>
                    {file.name}
                  </span>
                  <span className={darkModeClass(
                    "ml-2 text-xs",
                    "text-gray-500",
                    "text-gray-400"
                  )}>
                    ({formatBytes(file.size)})
                  </span>
                </div>
                <IconButton
                  icon={<X size={16} />}
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  variant="ghost"
                  size="sm"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className={combineAnimations(
            "mt-1 text-sm text-red-500",
            TRANSITIONS.default,
            "animate-slideIn"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/* Example usage:
import { z } from 'zod';

const schema = z.object({
  avatar: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      file => ['image/jpeg', 'image/png'].includes(file.type),
      'Only JPEG and PNG files are allowed'
    ),
  documents: z
    .array(z.instanceof(File))
    .min(1, 'At least one document is required')
    .max(5, 'Maximum 5 documents allowed')
    .refine(
      files => files.every(file => file.size <= 10 * 1024 * 1024),
      'Each file must be less than 10MB'
    ),
});

function UploadForm() {
  return (
    <Form
      schema={schema}
      onSubmit={async (data) => {
        const formData = new FormData();
        formData.append('avatar', data.avatar);
        data.documents.forEach(file => {
          formData.append('documents', file);
        });
        await uploadFiles(formData);
      }}
    >
      <div className="space-y-6">
        <FileField
          name="avatar"
          label="Profile Picture"
          description="JPEG or PNG, max 5MB"
          accept="image/jpeg,image/png"
          maxSize={5 * 1024 * 1024}
        />
        
        <FileField
          name="documents"
          label="Documents"
          description="PDF, DOC, DOCX up to 10MB each (max 5 files)"
          accept=".pdf,.doc,.docx"
          maxSize={10 * 1024 * 1024}
          multiple
        />
        
        <Button type="submit">
          Upload Files
        </Button>
      </div>
    </Form>
  );
}
*/