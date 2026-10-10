import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { ComponentProps } from "react";

function A(props: ComponentProps<"a">) {
  const href = props.href ?? "";
  const external = /^https?:\/\//.test(href);
  return <a {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} />;
}

/** Renders MDX source with the site's prose styles. Add custom components here. */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        components={{ a: A }}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
      />
    </div>
  );
}
