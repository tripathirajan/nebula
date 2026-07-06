import { expect, userEvent, within } from '@storybook/test';

import { Accordion } from './accordion';
import { AccordionContent } from './accordion-content';
import { AccordionHeader } from './accordion-header';
import { AccordionItem } from './accordion-item';
import { AccordionTrigger } from './accordion-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { type: 'single' },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

function FaqAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>What is nebula?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>A composable React UI platform.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Is it themeable?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Yes — every color is a CSS variable, overridable without a rebuild.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const Default: Story = {
  render: () => <FaqAccordion />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('A composable React UI platform.')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Is it themeable?' }));
    await expect(
      canvas.getByText('Yes — every color is a CSS variable, overridable without a rebuild.'),
    ).toBeVisible();
  },
};
