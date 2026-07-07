import * as React from 'react';

type CarouselOrientation = 'horizontal' | 'vertical';

interface CarouselContextValue {
  index: number;
  setIndex: (index: number) => void;
  count: number;
  loop: boolean;
  orientation: CarouselOrientation;
}

/**
 * Plain `React.createContext`, not `@nebula/primitives`' `createContextScope`
 * — every other compound component's scoped context in this workspace
 * exists so a *different* component can compose its own instance into the
 * same scope (e.g. `NavigationMenuItem` minting an unscoped `Popover`, or
 * `AlertDialog` reusing `Dialog`'s scope directly). `Carousel` has no
 * `headless` counterpart and nothing else in this project ever needs to
 * nest another component into its scope, so the extra
 * scope-composition machinery `createContextScope` provides would be unused
 * ceremony here — same reasoning applies to `DataTable`'s context.
 */
const CarouselContext = React.createContext<CarouselContextValue | undefined>(undefined);

function useCarouselContext(consumerName: string): CarouselContextValue {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within a \`Carousel\`.`);
  }
  return context;
}

export { CarouselContext, useCarouselContext };
export type { CarouselContextValue, CarouselOrientation };
