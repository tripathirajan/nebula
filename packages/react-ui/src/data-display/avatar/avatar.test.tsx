import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Avatar } from './avatar';
import { AvatarFallback } from './avatar-fallback';
import { AvatarImage } from './avatar-image';

describe('Avatar (ui)', () => {
  it('shows the fallback immediately when there is no image', () => {
    render(
      <Avatar>
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('JC')).toBeInTheDocument();
  });

  it('hides the fallback once the image reports load', async () => {
    render(
      <Avatar>
        <AvatarImage src="/jane.jpg" alt="Jane Cooper" />
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>,
    );
    // jsdom never actually fetches the image — simulate the browser event.
    fireEvent.load(screen.getByAltText('Jane Cooper'));

    await waitFor(() => {
      expect(screen.queryByText('JC')).not.toBeInTheDocument();
    });
  });

  it('keeps the image out of the DOM and shows the fallback on error', async () => {
    render(
      <Avatar>
        <AvatarImage src="/broken.jpg" alt="Jane Cooper" />
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>,
    );
    fireEvent.error(screen.getByAltText('Jane Cooper'));

    await waitFor(() => {
      expect(screen.queryByAltText('Jane Cooper')).not.toBeInTheDocument();
      expect(screen.getByText('JC')).toBeInTheDocument();
    });
  });

  it('delays rendering the fallback by delayMs', async () => {
    render(
      <Avatar>
        <AvatarFallback delayMs={50}>JC</AvatarFallback>
      </Avatar>,
    );
    expect(screen.queryByText('JC')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('JC')).toBeInTheDocument());
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JC</AvatarFallback>
      </Avatar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
