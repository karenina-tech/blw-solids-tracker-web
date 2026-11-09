import ReactMarkdown from 'react-markdown';

const isExternal = (href?: string) => !!href && /^https?:\/\//.test(href);

// react-markdown passes its AST `node` to every component; it must not reach the DOM.
function clean<P extends { node?: unknown }>(props: P): Omit<P, 'node'> {
  const { node, ...rest } = props;
  void node;
  return rest;
}

export function ArticleBody({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: (props) => <h2 className="mt-10 mb-3 text-2xl font-bold text-accent-700" {...clean(props)} />,
        h3: (props) => <h3 className="mt-6 mb-2 text-lg font-semibold text-slate-700" {...clean(props)} />,
        p: (props) => <p className="my-4 leading-7 text-slate-700" {...clean(props)} />,
        ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6 text-slate-700" {...clean(props)} />,
        ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6 text-slate-700" {...clean(props)} />,
        li: (props) => <li className="leading-7" {...clean(props)} />,
        strong: (props) => <strong className="font-semibold text-slate-800" {...clean(props)} />,
        blockquote: (props) => (
          <blockquote
            className="my-6 border-l-4 border-accent-300 bg-white/60 px-4 py-2 text-slate-600"
            {...clean(props)}
          />
        ),
        a: (props) => {
          const { href, ...rest } = clean(props);
          return (
            <a
              href={href}
              className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
              {...(isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              {...rest}
            />
          );
        },
      }}>
      {markdown}
    </ReactMarkdown>
  );
}
