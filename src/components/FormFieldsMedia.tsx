import React, { useState, useEffect } from 'react';
import { useFormContext } from './Form';
import { Image as ImageIcon, X, Upload, AlertCircle } from 'lucide-react';
import { darkModeClass } from '../hooks/useDarkMode';
import { TRANSITIONS, combineAnimations } from '../utils/animations';
import IconButton from './IconButton';

interface ImageFieldProps {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  maxSize?: number;
  accept?: string;
  aspectRatio?: number;
  previewSize?: {
    width: number;
    height: number;
  };
  defaultImage?: string;
  onImageChange?: (file: File | null) => void;
}

// Helper to validate image dimensions
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function ImageField({
  name,
  label,
  description,
  required,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = 'image/*',
  aspectRatio,
  previewSize = { width: 200, height: 200 },
  defaultImage,
  onImageChange,
}: ImageFieldProps) {
  const { register, formState: { errors }, setValue } = useFormContext();
  const [preview, setPreview] = useState<string | null>(() => defaultImage || null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const formError = errors[name]?.message as string | undefined;

  const { onChange, ...registerProps } = register(name);

  useEffect(() => {
    // Cleanup preview URL on unmount
    return () => {
      if (preview && preview !== defaultImage) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, defaultImage]);

  const validateImage = async (file: File): Promise<boolean> => {
    if (!file.type.startsWith('image/')) {
      setError('Selected file is not an image');
      return false;
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${formatBytes(maxSize)}`);
      return false;
    }

    try {
      if (aspectRatio) {
        const { width, height } = await getImageDimensions(file);
        const ratio = width / height;
        const tolerance = 0.1; // Allow 10% deviation
        if (Math.abs(ratio - aspectRatio) > tolerance) {
          setError(`Image must have an aspect ratio of ${aspectRatio}`);
          return false;
        }
      }
      return true;
    } catch (err) {
      setError('Invalid image file');
      return false;
    }
  };

  const handleImageChange = async (file: File | null) => {
    setError(null);

    if (!file) {
      setPreview(defaultImage || null);
      setValue(name, null);
      onImageChange?.(null);
      return;
    }

    const isValid = await validateImage(file);
    if (!isValid) {
      setValue(name, null);
      onImageChange?.(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setValue(name, file);
    onImageChange?.(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleImageChange(file);
  };

  const handleRemove = () => {
    handleImageChange(null);
  };

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
          "relative rounded-lg border-2 border-dashed",
          "transition duration-300 ease-in-out",
          darkModeClass(
            "bg-white dark:bg-gray-800",
            dragActive ? "border-indigo-500" : "border-gray-300",
            dragActive ? "border-indigo-400" : "border-gray-700"
          ),
          (error || formError) ? "border-red-500" : "",
        )}
        style={{
          width: previewSize.width,
          height: previewSize.height,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={name}
          accept={accept}
          className="sr-only"
          onChange={handleChange}
          {...registerProps}
        />

        {preview ? (
          <div className="relative w-full h-full group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <IconButton
                  icon={<X size={20} />}
                  onClick={handleRemove}
                  aria-label="Remove image"
                  variant="ghost"
                  className="text-white hover:text-red-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor={name}
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <div className="text-center p-4">
              <Upload
                className={darkModeClass(
                  "mx-auto h-12 w-12 mb-4",
                  "text-gray-400",
                  "text-gray-500"
                )}
              />
              <p className={darkModeClass(
                "text-sm",
                "text-gray-500",
                "text-gray-400"
              )}>
                Click to upload or drag and drop
              </p>
              {description && (
                <p className={darkModeClass(
                  "text-xs mt-2",
                  "text-gray-400",
                  "text-gray-500"
                )}>
                  {description}
                </p>
              )}
            </div>
          </label>
        )}
      </div>

      {(error || formError) && (
        <div className="flex items-center space-x-2 text-red-500">
          <AlertCircle size={16} />
          <p className="text-sm">{error || formError}</p>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/* Example usage:
import { z } from 'zod';

const schema = z.object({
  avatar: z
    .custom<File>()
    .nullable()
    .refine(
      file => !file || file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    )
    .refine(
      file => !file || file.type.startsWith('image/'),
      'File must be an image'
    ),
});

function ProfileForm() {
  return (
    <Form schema={schema} onSubmit={handleSubmit}>
      <ImageField
        name="avatar"
        label="Profile Picture"
        description="Square image recommended, max 5MB"
        required
        aspectRatio={1}
        previewSize={{ width: 200, height: 200 }}
        defaultImage={user.avatarUrl}
        onImageChange={(file) => {
          if (file) {
            // Handle immediate preview
            console.log('Image selected:', file);
          }
        }}
      />
    </Form>
  );
}
*/