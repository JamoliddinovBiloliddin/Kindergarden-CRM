
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface ImageUploadProps {
    value?: string;
    onChange: (base64: string) => void;
    label?: string;
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label, className }) => {
    const { t } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate type
        if (!file.type.startsWith('image/')) {
            setError('Faqat rasmlar yuklanishi mumkin');
            return;
        }

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Rasm hajmi 5MB dan oshmasligi kerak');
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}

            <div className="flex items-center gap-4">
                <div className="relative group w-24 h-24 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors">
                    {value ? (
                        <>
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </>
                    ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        {value ? (t('change_photo') || 'Rasmni o\'zgartirish') : (t('upload_photo') || 'Rasm yuklash')}
                    </Button>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                    <p className="text-xs text-muted-foreground">Max: 5MB (JPG, PNG)</p>
                </div>
            </div>
        </div>
    );
};
