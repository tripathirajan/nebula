import { expect, userEvent, within } from '@storybook/test';


import { Accordion } from './accordion';
import { AccordionContent } from './accordion-content';
import { AccordionHeader } from './accordion-header';
import { AccordionItem } from './accordion-item';
import { AccordionTrigger } from './accordion-trigger';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  // `Accordion`'s `type` prop is a required discriminant (no sensible
  // default — `single` vs `multiple` is a real behavioral choice a consumer
  // must make), so `Meta`/`StoryObj` need a default `args` satisfying it.
  // Every story below overrides via its own `render` anyway.
  args: { type: 'single' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

function FaqAccordion({ collapsible = true }: { collapsible?: boolean }) {
  return (
    <Accordion type="single" collapsible={collapsible} defaultValue="item-1">
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
        <AccordionContent>Yes, via @nebula/react-ui&apos;s token system.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" disabled>
        <AccordionHeader>
          <AccordionTrigger>Locked item</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Not reachable while disabled.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const Default: Story = {
  render: () => <FaqAccordion />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole('button', { name: 'What is nebula?' });
    const secondTrigger = canvas.getByRole('button', { name: 'Is it themeable?' });

    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(secondTrigger);
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    // type="single": opening the second item closes the first.
    await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['item-1']}>
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>First</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>First content.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Second</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Second content.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: 'First' });
    const second = canvas.getByRole('button', { name: 'Second' });

    await userEvent.click(second);
    // type="multiple": both stay open independently.
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(second).toHaveAttribute('aria-expanded', 'true');
  },
};

export const KeyboardNavigation: Story = {
  render: () => <FaqAccordion />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole('button', { name: 'What is nebula?' });
    const secondTrigger = canvas.getByRole('button', { name: 'Is it themeable?' });

    firstTrigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(secondTrigger).toHaveFocus();
    // Moving focus alone doesn't toggle — only Enter/Space (native button semantics) does.
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.keyboard('{Enter}');
    await expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
  },
};
