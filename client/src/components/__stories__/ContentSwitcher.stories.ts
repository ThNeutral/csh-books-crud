import type { Meta, StoryObj } from "@storybook/react";

import { ContentSwitcher } from "../ContentSwitcher";

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof ContentSwitcher> = {
  component: ContentSwitcher,
};

export default meta;
type Story = StoryObj<typeof ContentSwitcher>;

export const ContentSwitcherStory: Story = {};
