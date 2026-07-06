import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Tooltip } from './tooltip';
import { TooltipContent } from './tooltip-content';
import { TooltipPortal } from './tooltip-portal';
import { TooltipTrigger } from './tooltip-trigger';

function DemoTooltip() {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>Save</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>Save your changes</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

describe('Tooltip (ui)', () => {
  it('opens on pointer enter and renders the styled content', async () => {
    render(<DemoTooltip />);
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByRole('tooltip').className).toContain('bg-[var(--tooltip-content-bg)]');
    });
  });

  it('closes on pointer leave', async () => {
    render(<DemoTooltip />);
    const trigger = screen.getByRole('button', { name: 'Save' });
    fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

    fireEvent.pointerLeave(trigger);
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('has no axe violations', async () => {
    render(<DemoTooltip />);
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => screen.getByRole('tooltip'));
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
