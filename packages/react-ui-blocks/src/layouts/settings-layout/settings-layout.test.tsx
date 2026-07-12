import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { SettingsLayout } from './settings-layout';

beforeEach(() => {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
});

describe('SettingsLayout (block)', () => {
  it('renders the sidebar and content', () => {
    render(
      <SettingsLayout title="Settings" sidebar={<nav>Profile</nav>}>
        <div>Profile form</div>
      </SettingsLayout>,
    );
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Profile form')).toBeInTheDocument();
  });

  it('labels the sidebar landmark "Settings"', () => {
    render(
      <SettingsLayout title="Settings" sidebar={<nav>Profile</nav>}>
        <div>Profile form</div>
      </SettingsLayout>,
    );
    expect(screen.getByRole('complementary', { name: 'Settings' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <SettingsLayout title="Settings" sidebar={<nav>Profile</nav>}>
        <div>Profile form</div>
      </SettingsLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
