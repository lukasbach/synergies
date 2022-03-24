import { addParameters } from '@storybook/client-api';

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

addParameters({
  // viewMode: 'docs', // Remove if default view should be canvas mode
  layout: "fullscreen",
});

export const decorators = [
  (Story) => (
    <div style={{ margin: "8px" }}>
      <Story />
    </div>
  ),
];
