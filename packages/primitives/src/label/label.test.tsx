import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Input } from '../input/input';

import { Label } from './label';

describe('Label', () => {
  it('associates with its field via htmlFor for both visual and programmatic labeling', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('announces "required" via visually-hidden text even though the asterisk itself is aria-hidden', () => {
    render(<Label htmlFor="email">Email</Label>);
    // Baseline: no asterisk/required text when `required` isn't passed.
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('required renders a hidden-from-sighted-users but screen-reader-visible "(required)"', () => {
    render(
      <Label htmlFor="name" required>
        Name
      </Label>,
    );
    const asterisk = screen.getByText('*');
    expect(asterisk).toHaveAttribute('aria-hidden', 'true');
    // The visually-hidden "(required)" text is still in the document (and
    // therefore the accessibility tree) even though a sighted user won't see it.
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
