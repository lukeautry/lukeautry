// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';

// Custom remark plugin to transform directives into admonition components
function remarkAdmonitions() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        const name = node.name;

        // Map directive names to admonition types
        const admonitionTypes = ['note', 'tip', 'caution', 'danger', 'info'];

        if (admonitionTypes.includes(name)) {
          data.hName = 'div';
          data.hProperties = {
            className: `admonition admonition-${name}`,
            'data-admonition': name,
            ...attributes,
          };
        }
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkAdmonitions],
  },
});
