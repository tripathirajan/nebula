import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NavigationMenu } from './navigation-menu';
import { NavigationMenuContent } from './navigation-menu-content';
import { NavigationMenuItem } from './navigation-menu-item';
import { NavigationMenuLink } from './navigation-menu-link';
import { NavigationMenuList } from './navigation-menu-list';
import { NavigationMenuTrigger } from './navigation-menu-trigger';

function DemoNavigationMenu(props: { openDelay?: number; closeDelay?: number }) {
  return (
    <NavigationMenu openDelay={props.openDelay ?? 0} closeDelay={props.closeDelay ?? 0} aria-label="Main">
      <NavigationMenuList>
        <NavigationMenuItem value="products">
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <a href="/a">Product A</a>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="company">
          <NavigationMenuTrigger>Company</NavigationMenuTrigger>
          <NavigationMenuContent>
            <a href="/about">About</a>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" active>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

describe('NavigationMenu', () => {
  it('renders a nav landmark with the given aria-label', () => {
    render(<DemoNavigationMenu />);
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
  });

  it('is closed initially', () => {
    render(<DemoNavigationMenu />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('opens content on pointer enter', async () => {
    render(<DemoNavigationMenu />);
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'Products' }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Products' })).toHaveAttribute(
        'aria-expanded',
        'true',
      ),
    );
    expect(screen.getByText('Product A')).toBeInTheDocument();
  });

  it('closes on pointer leave (after closeDelay)', async () => {
    render(<DemoNavigationMenu />);
    const trigger = screen.getByRole('button', { name: 'Products' });
    fireEvent.pointerEnter(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));

    fireEvent.pointerLeave(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  });

  it('click toggles content open/closed immediately', async () => {
    render(<DemoNavigationMenu />);
    const trigger = screen.getByRole('button', { name: 'Products' });

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('switching to another trigger while one is open closes the first and opens the second', async () => {
    render(<DemoNavigationMenu />);
    const productsTrigger = screen.getByRole('button', { name: 'Products' });
    const companyTrigger = screen.getByRole('button', { name: 'Company' });

    fireEvent.click(productsTrigger);
    expect(productsTrigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.pointerEnter(companyTrigger);
    await waitFor(() => expect(companyTrigger).toHaveAttribute('aria-expanded', 'true'));
    expect(productsTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape', async () => {
    render(<DemoNavigationMenu />);
    const trigger = screen.getByRole('button', { name: 'Products' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
  });

  it('marks an active NavigationMenuLink with aria-current="page"', () => {
    render(<DemoNavigationMenu />);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('aria-current', 'page');
  });

  describe('openDelay/closeDelay', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('waits openDelay before opening on hover', () => {
      render(<DemoNavigationMenu openDelay={300} closeDelay={300} />);
      const trigger = screen.getByRole('button', { name: 'Products' });

      fireEvent.pointerEnter(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('pointer entering the content cancels the pending close timer', () => {
      render(<DemoNavigationMenu openDelay={0} closeDelay={300} />);
      const trigger = screen.getByRole('button', { name: 'Products' });

      fireEvent.pointerEnter(trigger);
      act(() => {
        vi.advanceTimersByTime(0);
      });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      fireEvent.pointerLeave(trigger);
      const content = screen.getByText('Product A').closest('[role="dialog"]') as HTMLElement;
      fireEvent.pointerEnter(content);

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoNavigationMenu />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
