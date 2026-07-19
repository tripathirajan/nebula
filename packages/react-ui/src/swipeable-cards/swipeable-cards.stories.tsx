import { expect, fireEvent, within } from '@storybook/test';

import { SwipeableCards } from './swipeable-cards';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SwipeableCards> = {
  title: 'React UI/SwipeableCards',
  component: SwipeableCards,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

interface BankCard {
  id: string;
  type: 'Debit' | 'Credit';
  holder: string;
  number: string;
  expiry: string;
  gradient: string;
}

const bankCards: BankCard[] = [
  {
    id: 'card-1',
    type: 'Debit',
    holder: 'Rajan Tripathi',
    number: '4321',
    expiry: '08/28',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)',
  },
  {
    id: 'card-2',
    type: 'Credit',
    holder: 'Rajan Tripathi',
    number: '8890',
    expiry: '11/27',
    gradient: 'linear-gradient(135deg, #f97316 0%, #db2777 100%)',
  },
  {
    id: 'card-3',
    type: 'Debit',
    holder: 'Rajan Tripathi',
    number: '2245',
    expiry: '02/29',
    gradient: 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
  },
  {
    id: 'card-4',
    type: 'Credit',
    holder: 'Rajan Tripathi',
    number: '5567',
    expiry: '05/26',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  },
];

function BankCardFace({ card }: { card: BankCard }) {
  return (
    <div
      className="flex h-full w-full flex-col justify-between rounded-2xl p-5 text-white shadow-lg"
      style={{ background: card.gradient }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-white/80">{card.type} Card</span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white/90">
          <rect x="2" y="6" width="20" height="14" rx="2" fillOpacity={0.25} />
          <rect x="4" y="9" width="6" height="4" rx="1" />
        </svg>
      </div>
      <div>
        <p className="font-mono text-lg tracking-widest">•••• •••• •••• {card.number}</p>
        <div className="mt-2 flex items-center justify-between text-xs text-white/80">
          <span>{card.holder}</span>
          <span>{card.expiry}</span>
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  name: 'Colorful bank card stack (swipe, no arrows)',
  render: () => (
    <div className="aspect-[1.6/1] w-80">
      <SwipeableCards
        items={bankCards}
        getItemId={(card) => card.id}
        renderCard={(card) => <BankCardFace card={card} />}
        aria-label="My cards"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Debit Card|Credit Card/)).toBeInTheDocument();

    const front = canvas.getByText('•••• •••• •••• 4321').closest('[role="group"]')!;
    fireEvent.pointerDown(front, { pointerId: 1, clientX: 200, clientY: 0 });
    fireEvent.pointerMove(front, { pointerId: 1, clientX: 60, clientY: 0 });
    fireEvent.pointerUp(front, { pointerId: 1, clientX: 60, clientY: 0 });

    await expect(canvas.getByText('•••• •••• •••• 8890').closest('[role="group"]')).toHaveAttribute(
      'data-state',
      'active',
    );
  },
};

export const Looping: Story = {
  name: 'Looping (wraps at the bounds)',
  render: () => (
    <div className="aspect-[1.6/1] w-80">
      <SwipeableCards
        items={bankCards}
        getItemId={(card) => card.id}
        renderCard={(card) => <BankCardFace card={card} />}
        loop
        aria-label="My cards, looping"
      />
    </div>
  ),
};

export const TwoCards: Story = {
  name: 'A small deck (2 cards)',
  render: () => (
    <div className="aspect-[1.6/1] w-80">
      <SwipeableCards
        items={bankCards.slice(0, 2)}
        getItemId={(card) => card.id}
        renderCard={(card) => <BankCardFace card={card} />}
        aria-label="My cards"
      />
    </div>
  ),
};
