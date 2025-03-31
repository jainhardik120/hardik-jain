import { Tailwind, Font, Head, Html, render } from '@react-email/components';
import htmlParser from 'prettier/plugins/html';
import { format } from 'prettier/standalone';

import config from 'tailwind.config';

import { ComponentMap, type Layout, type LayoutItem } from '@/components/email-editor/types';

const renderComponent = (item: LayoutItem): React.ReactNode => {
  const Component = ComponentMap[item.type];

  if (item.children && item.children.length > 0) {
    return (
      <Component key={item.id} input={item.props}>
        {item.children.map(renderComponent)}
      </Component>
    );
  }

  return <Component key={item.id} input={item.props} />;
};

const DynamicEmailComponent = ({ layout }: { layout: Layout }) => {
  return <Tailwind config={config}>{layout.items.map(renderComponent)}</Tailwind>;
};

export const renderLayoutToHtml = async (layout: Layout): Promise<string> => {
  const html = await render(
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <DynamicEmailComponent layout={layout} />
    </Html>,
  );

  try {
    const formatted = await format(html, {
      htmlWhitespaceSensitivity: 'ignore',
      parser: 'html',
      plugins: [htmlParser],
    });
    return formatted;
  } catch {
    return html;
  }
};
