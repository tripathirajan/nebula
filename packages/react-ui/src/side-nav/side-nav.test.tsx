import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SideNav } from './side-nav';

describe('SideNav (ui)', () => {
  it('renders as a navigation landmark with its content', () => {
    render(
      <SideNav>
        <a href="/">Home</a>
      </SideNav>,
    );
    expect(screen.getByRole('navigation')).toHaveTextContent('Home');
  });

  it('stacks children vertically', () => {
    render(
      <SideNav>
        <a href="/">Home</a>
      </SideNav>,
    );
    expect(screen.getByRole('navigation').className).toContain('flex-col');
  });
});
