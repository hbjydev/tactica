import { useCallback, useEffect, useRef, useState } from 'react';
import { IconCheck, IconSelector, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type Option = { id: string; label: string };

type Props = {
    name: string;
    unitSlug: string;
    defaultValue?: string | null;
    defaultLabel?: string | null;
};

export function MemberSelect({
    name,
    unitSlug,
    defaultValue,
    defaultLabel,
}: Props) {
    const initialId =
        defaultValue && defaultValue !== 'null' ? defaultValue : null;
    const initialLabel = initialId ? (defaultLabel ?? null) : null;

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Option | null>(
        initialId && initialLabel
            ? { id: initialId, label: String(initialLabel) }
            : null,
    );

    const abortRef = useRef<AbortController | null>(null);

    const fetchMembers = useCallback(
        async (q: string) => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setLoading(true);
            try {
                const url = new URL(
                    `/members/search`,
                    `${window.location.protocol}//${unitSlug}.${window.location.host.replace(/^[^.]+\./, '')}`,
                );
                url.searchParams.set('q', q);

                const res = await fetch(url.toString(), {
                    signal: controller.signal,
                    headers: { Accept: 'application/json' },
                });
                const data: Option[] = await res.json();
                setOptions(data);
            } catch (e) {
                if ((e as DOMException).name !== 'AbortError') setOptions([]);
            } finally {
                setLoading(false);
            }
        },
        [unitSlug],
    );

    useEffect(() => {
        if (search.length < 3) {
            setOptions([]);
            return;
        }
        const t = setTimeout(() => fetchMembers(search), 300);
        return () => clearTimeout(t);
    }, [search, fetchMembers]);

    const hiddenValue = selected ? selected.id : 'null';

    const handleSelect = (opt: Option) => {
        setSelected(opt);
        setOpen(false);
        setSearch('');
    };

    const handleClear = () => {
        setSelected(null);
    };

    return (
        <>
            <input type="hidden" name={name} value={hiddenValue} />
            <div className="flex w-full items-center gap-1">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="flex-1 justify-between font-normal"
                        >
                            <span
                                className={cn(
                                    'truncate',
                                    !selected && 'text-muted-foreground',
                                )}
                            >
                                {selected
                                    ? selected.label
                                    : 'No member assigned'}
                            </span>
                            <IconSelector className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-[--radix-popover-trigger-width] p-0"
                        align="start"
                    >
                        <Command shouldFilter={false}>
                            <CommandInput
                                placeholder="Type a name to search..."
                                value={search}
                                onValueChange={setSearch}
                            />
                            <CommandList>
                                {loading && (
                                    <div className="flex items-center justify-center py-4">
                                        <Spinner className="size-4" />
                                    </div>
                                )}
                                {!loading && search.length < 3 && (
                                    <CommandEmpty>
                                        Type at least 3 characters to search.
                                    </CommandEmpty>
                                )}
                                {!loading &&
                                    search.length >= 3 &&
                                    options.length === 0 && (
                                        <CommandEmpty>
                                            No members found.
                                        </CommandEmpty>
                                    )}
                                {options.length > 0 && (
                                    <CommandGroup>
                                        {options.map((opt) => (
                                            <CommandItem
                                                key={opt.id}
                                                value={opt.id}
                                                onSelect={() =>
                                                    handleSelect(opt)
                                                }
                                                data-checked={
                                                    selected?.id === opt.id
                                                }
                                            >
                                                <IconCheck
                                                    className={cn(
                                                        'mr-2 size-4',
                                                        selected?.id === opt.id
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                                {opt.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {selected && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        aria-label="Clear member"
                        className="shrink-0"
                    >
                        <IconX className="size-3.5" />
                    </Button>
                )}
            </div>
        </>
    );
}
