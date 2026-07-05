import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Accordion } from './accordion';
import { AccordionContent } from './accordion-content';
import { AccordionHeader } from './accordion-header';
import { AccordionItem } from './accordion-item';
import { AccordionTrigger } from './accordion-trigger';

function DemoAccordion({ collapsible = true }: { collapsible?: boolean }) {
  return (
    <Accordion type="single" collapsible={collapsible} defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionHeader>
          <AccordionTrigger>First</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>First panel content.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader>
          <AccordionTrigger>Second</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Second panel content.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" disabled>
        <AccordionHeader>
          <AccordionTrigger>Third</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Third panel content.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('wires up aria-expanded/aria-controls/aria-labelledby between trigger and panel', () => {
    render(<DemoAccordion />);
    const firstTrigger = screen.getByRole('button', { name: 'First' });
    const firstPanel = screen.getByText('First panel content.');

    expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(firstTrigger).toHaveAttribute('aria-controls', firstPanel.id);
    expect(firstPanel).toHaveAttribute('aria-labelledby', firstTrigger.id);
  });

  it('type="single": opening one item closes the previously-open one', () => {
    render(<DemoAccordion />);
    const firstTrigger = screen.getByRole('button', { name: 'First' });
    const secondTrigger = screen.getByRole('button', { name: 'Second' });

    fireEvent.click(secondTrigger);
    expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('type="single" collapsible: clicking the open item collapses it, leaving none open', () => {
    render(<DemoAccordion />);
    const firstTrigger = screen.getByRole('button', { name: 'First' });

    fireEvent.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('type="single" non-collapsible: clicking the open item does nothing', () => {
    render(<DemoAccordion collapsible={false} />);
    const firstTrigger = screen.getByRole('button', { name: 'First' });

    fireEvent.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('type="multiple": items open independently without closing each other', () => {
    render(<Accordion type="multiple" defaultValue={['item-1']}>
      <AccordionItem value="item-1">
        <AccordionHeader><AccordionTrigger>First</AccordionTrigger></AccordionHeader>
        <AccordionContent>First</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionHeader><AccordionTrigger>Second</AccordionTrigger></AccordionHeader>
        <AccordionContent>Second</AccordionContent>
      </AccordionItem>
    </Accordion>);

    const first = screen.getByRole('button', { name: 'First' });
    const second = screen.getByRole('button', { name: 'Second' });

    fireEvent.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('ArrowDown moves focus between triggers without toggling them', () => {
    render(<DemoAccordion />);
    const firstTrigger = screen.getByRole('button', { name: 'First' });
    const secondTrigger = screen.getByRole('button', { name: 'Second' });

    firstTrigger.focus();
    fireEvent.keyDown(firstTrigger, { key: 'ArrowDown' });

    expect(secondTrigger).toHaveFocus();
    expect(secondTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('excludes disabled items from arrow-key navigation', () => {
    render(<DemoAccordion />);
    const secondTrigger = screen.getByRole('button', { name: 'Second' });
    const thirdTrigger = screen.getByRole('button', { name: 'Third' });

    expect(thirdTrigger).toBeDisabled();

    secondTrigger.focus();
    fireEvent.keyDown(secondTrigger, { key: 'ArrowDown' });

    expect(thirdTrigger).not.toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoAccordion />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
