import { Text } from '@nebula-lab/react-ui/text';

interface CreditCardVisualProps {
  brand: string;
  last4: string;
  expiry: string;
  holder: string;
}

/**
 * A stylized bank-card face (gradient background, masked number, brand
 * mark) — the "credit card visual" Minimals' Banking dashboard home pairs
 * with its balance summary card. Built locally rather than added to
 * `@nebula-lab/react-ui-blocks`: purely decorative, no interaction/state,
 * and specific enough to this one layout that it isn't worth a shared
 * component yet — see this template's own `AGENTS.md` note on templates
 * composing their own full-page layouts.
 */
export function CreditCardVisual(props: CreditCardVisualProps) {
  const { brand, last4, expiry, holder } = props;

  return (
    <div
      className="flex h-full min-h-[200px] flex-col justify-between rounded-[var(--radius-card)] p-6 text-white shadow-[var(--shadow-card)]"
      style={{
        background:
          'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in oklch, var(--color-primary) 60%, var(--color-accent)) 100%)',
      }}
    >
      <div className="flex items-start justify-between">
        <Text className="text-sm font-medium opacity-90">{brand}</Text>
        <div aria-hidden="true" className="h-6 w-9 rounded bg-white/25" />
      </div>
      <div className="flex flex-col gap-4">
        <Text className="text-xl font-semibold tracking-widest">•••• •••• •••• {last4}</Text>
        <div className="flex items-end justify-between">
          <div>
            <Text className="text-[10px] uppercase opacity-70">Card holder</Text>
            <Text className="text-sm font-medium">{holder}</Text>
          </div>
          <div>
            <Text className="text-[10px] uppercase opacity-70">Expires</Text>
            <Text className="text-sm font-medium">{expiry}</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
