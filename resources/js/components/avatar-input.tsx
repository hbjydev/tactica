import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { useRef, useState } from 'react';

type Props = {
    /** Form field name. Defaults to `'avatar'`. */
    name?: string;
    /** Label text rendered above the field. Defaults to `'Avatar'`. */
    label?: string;
    /** Existing avatar URL — shown on initial render until changed or removed. */
    currentUrl?: string | null;
    /** Fallback text (initials, `'?'`, etc.) shown when no image is present. */
    fallback: string;
    /**
     * When `true`, removing the avatar submits a hidden input with `value="null"`
     * so the backend can distinguish "no change" from "explicitly cleared".
     * Set this to `true` for edit forms, `false` (default) for create forms.
     */
    sendNullOnRemove?: boolean;
    /** Validation error message from the server. */
    error?: string;
};

export const AvatarInput = ({
    name = 'avatar',
    label = 'Avatar',
    currentUrl,
    fallback,
    sendNullOnRemove = false,
    error,
}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [removeAvatar, setRemoveAvatar] = useState(false);

    const hasAvatar = !removeAvatar && (previewUrl ?? currentUrl);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setRemoveAvatar(false);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemove = () => {
        setRemoveAvatar(true);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>
            <div className="flex items-center gap-4">
                <Avatar size="lg">
                    {hasAvatar ? (
                        <AvatarImage
                            src={(previewUrl ?? currentUrl) as string}
                            alt={`${label} preview`}
                        />
                    ) : null}
                    <AvatarFallback>{fallback}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {hasAvatar ? 'Change' : 'Upload'}
                        </Button>
                        {hasAvatar ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                onClick={handleRemove}
                            >
                                Remove
                            </Button>
                        ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Max 12MB. JPEG, PNG, GIF or WebP.
                    </p>
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                name={removeAvatar ? undefined : name}
                className="sr-only"
                accept="image/*"
                tabIndex={-1}
                onChange={handleFileChange}
            />
            {sendNullOnRemove && removeAvatar ? (
                <input type="hidden" name={name} value="null" />
            ) : null}
            {error ? <FieldError>{error}</FieldError> : null}
        </Field>
    );
};
