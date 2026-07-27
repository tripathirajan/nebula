// Small inline icon set for this template — matches nebula's own convention
// (bare stroke-based SVGs, `aria-hidden`, no icon-library dependency) used
// throughout `packages/react-ui-blocks/src/compositions/*.stories.tsx`.
import type { SVGProps } from 'react';

function baseProps(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    'aria-hidden': true,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-5 w-5',
    ...props,
  };
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

export function TransactionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V6h18" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v5H3" />
    </svg>
  );
}

export function WalletIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5Z" />
      <path d="M16 12h4" />
    </svg>
  );
}

export function TargetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

export function TrendUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
      <path d="M16 7h6v6" />
    </svg>
  );
}

export function TrendDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M22 17 13.5 8.5 8.5 13.5 2 7" />
      <path d="M16 17h6v-6" />
    </svg>
  );
}

export function PiggyBankIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps(props)}>
      <path d="M11 5a5 5 0 0 0-5 5v1H3l2 3v3a1 1 0 0 0 1 1h2v2h4v-2h2a5 5 0 0 0 5-5v-1a2 2 0 0 0 2-2 2 2 0 0 0-2-2c-.83-1.83-2.75-3-5-3Z" />
      <circle cx="15" cy="9" r="0.5" fill="currentColor" />
    </svg>
  );
}
