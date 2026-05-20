import { marked, Marked } from 'marked';

interface Heading {
    id: string;
    text: string;
    depth: 2 | 3;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// A Marked instance that injects `id` attributes into heading elements.
const markedWithIds = new Marked({
    renderer: {
        heading({
            depth,
            text,
        }: {
            depth: number;
            text: string;
            tokens: object[];
        }) {
            const id = slugify(text);
            return `<h${depth} id="${id}">${text}</h${depth}>\n`;
        },
    },
});

function parse(raw: string): { html: string; headings: Heading[] } {
    // Strip the top-level h1 — the layout renders the title already.
    const stripped = raw.replace(/^#\s+[^\n]+\n?/, '');

    // Extract h2/h3 headings for the TOC.
    const tokens = marked.lexer(stripped);
    const headings: Heading[] = [];
    for (const token of tokens) {
        if (
            token.type === 'heading' &&
            (token.depth === 2 || token.depth === 3)
        ) {
            headings.push({
                id: slugify(token.text),
                text: token.text,
                depth: token.depth as 2 | 3,
            });
        }
    }

    const html = (markedWithIds.parse(stripped) as string).trim();
    return { html, headings };
}

const proseClasses = [
    'text-[0.9375rem] leading-7 text-muted-foreground',
    '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:border-b [&_h2]:border-border/40 [&_h2]:pb-2',
    '[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground',
    '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:scroll-mt-24 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground',
    '[&_p]:mb-5 [&_p]:leading-7',
    '[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6',
    '[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6',
    '[&_li]:mb-1.5 [&_li]:leading-7',
    '[&_strong]:font-semibold [&_strong]:text-foreground',
    '[&_em]:italic',
    '[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4',
    '[&_a:hover]:text-muted-foreground [&_a:hover]:no-underline',
    '[&_hr]:my-10 [&_hr]:border-border/40',
    '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5',
    '[&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground',
].join(' ');

interface Props {
    raw: string;
}

export default function LegalProse({ raw }: Props) {
    const { html, headings } = parse(raw);

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[200px_1fr]">
            {/* sticky TOC sidebar */}
            <aside className="hidden lg:block">
                <div className="sticky top-24">
                    <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground/60 uppercase">
                        On this page
                    </p>
                    <nav className="flex flex-col gap-0.5">
                        {headings.map((h) => (
                            <a
                                key={h.id}
                                href={`#${h.id}`}
                                className={[
                                    'rounded px-2 py-1 text-sm transition-colors hover:bg-muted hover:text-foreground',
                                    h.depth === 2
                                        ? 'text-muted-foreground'
                                        : 'pl-4 text-muted-foreground/60',
                                ].join(' ')}
                            >
                                {h.text}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* prose content */}
            <div
                className={proseClasses}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
