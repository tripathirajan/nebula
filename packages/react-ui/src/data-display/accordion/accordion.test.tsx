import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Accordion } from './accordion';
import { AccordionContent } from './accordion-content';
import { AccordionHeader } from './accordion-header';
import { AccordionItem } from './accordion-item';
import { AccordionTrigger } from './accordion-trigger';

function DemoAccordion() {
  return (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1" data-testid="item-1">
        <AccordionHeader>
          <AccordionTrigger>Question one</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Answer one.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Question two</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Answer two.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion (ui)', () => {
  it('renders the headless behavior unchanged (opens on trigger click)', () => {
    render(<DemoAccordion />);
    // `AccordionContent` wraps its content in `Presence`, which (absent a
    // CSS animation/transition, as here) doesn't keep collapsed content
    // mounted at all — so the not-yet-opened item's content isn't in the
    // document, not just hidden.
    expect(screen.queryByText('Answer two.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Question two' }));
    expect(screen.getByText('Answer two.')).toBeVisible();
  });

  it('applies the border token to items', () => {
    render(<DemoAccordion />);
    expect(screen.getByTestId('item-1').className).toContain('border-[var(--accordion-border)]');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoAccordion />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
