import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PageSection } from './page-section';

describe('PageSection (block)', () => {
  it('renders children', () => {
    render(
      <PageSection>
        <p>Section content</p>
      </PageSection>,
    );
    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('does not render a header row when title/description/actions are all omitted', () => {
    render(
      <PageSection>
        <p>Content</p>
      </PageSection>,
    );
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders title, description, and actions when provided', () => {
    render(
      <PageSection title="Billing" description="Manage your plan." actions={<button>Upgrade</button>}>
        <p>Content</p>
      </PageSection>,
    );
    expect(screen.getByRole('heading', { name: 'Billing' })).toBeInTheDocument();
    expect(screen.getByText('Manage your plan.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument();
  });

  it('renders as a section landmark', () => {
    render(
      <PageSection title="Billing">
        <p>Content</p>
      </PageSection>,
    );
    expect(screen.getByRole('region', { name: 'Billing' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <PageSection title="Billing" description="Manage your plan." actions={<button>Upgrade</button>}>
        <p>Content</p>
      </PageSection>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
