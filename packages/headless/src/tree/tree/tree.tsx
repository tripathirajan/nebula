import { useControllableState } from '@nebula-lab/hooks';
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula-lab/primitives/compose-refs';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { TreeProvider } from './tree-context';

import type { ScopedProps } from './tree-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const TREE_NAME = 'Tree';
const TYPEAHEAD_RESET_MS = 500;

interface TreeSharedProps extends PrimitivePropsWithRef<'ul'> {
  disabled?: boolean;
  /** Controlled: which items' values are currently expanded. */
  expandedValues?: string[];
  /** Uncontrolled: which items' values start out expanded. */
  defaultExpandedValues?: string[];
  onExpandedValuesChange?: (values: string[]) => void;
}

interface TreeSingleProps extends TreeSharedProps {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
}

interface TreeMultipleProps extends TreeSharedProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

/** Discriminated on `type`, same split `Listbox`/`Accordion`/`ToggleGroup` use. */
type TreeProps = TreeSingleProps | TreeMultipleProps;

/**
 * Root of the Tree compound component — `role="tree"` over a set of nested
 * {@link TreeItem}s, the WAI-ARIA
 * [Tree View pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).
 *
 * Unlike `Listbox` (a flat list), Tree items nest arbitrarily deep, so its
 * keyboard navigation is implemented from scratch here rather than reusing
 * `@nebula-lab/primitives`' `RovingFocusGroup` (which assumes one flat group of
 * items — it has no notion of "this item's children" or "collapse and move
 * focus to my parent"). Collapsed `TreeGroup`s unmount entirely (see
 * `tree-group.tsx`), so a plain `[role="treeitem"]` DOM query already yields
 * exactly the currently-*visible* items in visual order — the same
 * "query the DOM instead of tracking a separate registry" simplification
 * `Listbox`'s typeahead and `Combobox`'s highlight-navigation use.
 *
 * @example
 * ```tsx
 * <Tree type="single" defaultValue="src" defaultExpandedValues={['src']}>
 *   <TreeItem value="src" expandable>
 *     <TreeItemToggle aria-label="Toggle expanded">▸</TreeItemToggle>
 *     src
 *     <TreeGroup>
 *       <TreeItem value="src/index.ts">index.ts</TreeItem>
 *     </TreeGroup>
 *   </TreeItem>
 * </Tree>
 * ```
 */
const Tree = React.forwardRef<HTMLUListElement, ScopedProps<TreeProps>>((props, forwardedRef) => {
  if (props.type === 'multiple') {
    return <TreeImplMultiple {...props} ref={forwardedRef} />;
  }
  return <TreeImplSingle {...props} ref={forwardedRef} />;
});

Tree.displayName = TREE_NAME;

const TreeImplSingle = React.forwardRef<HTMLUListElement, ScopedProps<TreeSingleProps>>(
  (props, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, type: _type, ...implProps } = props;

    const [value, setValue] = useControllableState<string | undefined>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    return (
      <TreeImpl
        {...implProps}
        ref={forwardedRef}
        isItemSelected={(itemValue) => itemValue === value}
        onItemSelectedChange={(itemValue) => setValue(itemValue)}
      />
    );
  },
);

TreeImplSingle.displayName = 'TreeImplSingle';

const TreeImplMultiple = React.forwardRef<HTMLUListElement, ScopedProps<TreeMultipleProps>>(
  (props, forwardedRef) => {
    const { value: valueProp, defaultValue, onValueChange, type: _type, ...implProps } = props;

    const [value, setValue] = useControllableState<string[]>({
      prop: valueProp,
      defaultProp: defaultValue ?? [],
      onChange: onValueChange,
    });

    return (
      <TreeImpl
        {...implProps}
        ref={forwardedRef}
        isItemSelected={(itemValue) => (value ?? []).includes(itemValue)}
        onItemSelectedChange={(itemValue, selected) => {
          setValue((current) => {
            const currentValues = current ?? [];
            return selected
              ? [...currentValues, itemValue]
              : currentValues.filter((v) => v !== itemValue);
          });
        }}
      />
    );
  },
);

TreeImplMultiple.displayName = 'TreeImplMultiple';

interface TreeImplProps extends PrimitivePropsWithRef<'ul'> {
  disabled?: boolean;
  expandedValues?: string[];
  defaultExpandedValues?: string[];
  onExpandedValuesChange?: (values: string[]) => void;
  isItemSelected: (value: string) => boolean;
  onItemSelectedChange: (value: string, selected: boolean) => void;
}

function isEnabledTreeItem(element: Element): element is HTMLElement {
  return element.getAttribute('aria-disabled') !== 'true';
}

const TreeImpl = React.forwardRef<HTMLUListElement, ScopedProps<TreeImplProps>>(
  (props, forwardedRef) => {
    const {
      __scopeTree,
      disabled = false,
      expandedValues: expandedValuesProp,
      defaultExpandedValues,
      onExpandedValuesChange,
      isItemSelected,
      onItemSelectedChange,
      onKeyDown,
      ...rootProps
    } = props;

    const rootRef = React.useRef<HTMLUListElement>(null);
    const composedRef = useComposedRefs(forwardedRef, rootRef);
    const typeaheadBuffer = React.useRef('');
    const typeaheadTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const [expandedValues, setExpandedValues] = useControllableState<string[]>({
      prop: expandedValuesProp,
      defaultProp: defaultExpandedValues ?? [],
      onChange: onExpandedValuesChange,
    });

    const [explicitActiveValue, setExplicitActiveValue] = React.useState<string | undefined>(
      undefined,
    );
    const [firstRegisteredValue, setFirstRegisteredValue] = React.useState<string | undefined>(
      undefined,
    );
    const activeValue = explicitActiveValue ?? firstRegisteredValue;

    const registerItem = React.useCallback((itemValue: string) => {
      setFirstRegisteredValue((current) => current ?? itemValue);
    }, []);

    const visibleItems = (): HTMLElement[] => {
      const root = rootRef.current;
      if (!root) return [];
      return Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
    };

    const focusItem = (element: HTMLElement | undefined | null) => {
      if (!element) return;
      element.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const root = rootRef.current;
      if (!root || disabled) return;
      const current = event.target as HTMLElement;
      if (!current.matches('[role="treeitem"]')) return;

      const items = visibleItems().filter(isEnabledTreeItem);
      const index = items.indexOf(current);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          focusItem(items[index + 1] ?? items[items.length - 1]);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          focusItem(items[index - 1] ?? items[0]);
          break;
        }
        case 'Home': {
          event.preventDefault();
          focusItem(items[0]);
          break;
        }
        case 'End': {
          event.preventDefault();
          focusItem(items[items.length - 1]);
          break;
        }
        case 'ArrowRight': {
          const itemValue = current.getAttribute('data-value');
          const expandable = current.getAttribute('aria-expanded') !== null;
          const expanded = current.getAttribute('aria-expanded') === 'true';
          if (!itemValue || !expandable) break;
          event.preventDefault();
          if (!expanded) {
            setExpandedValues((values) => [...(values ?? []), itemValue]);
          } else {
            const firstChild = current.querySelector<HTMLElement>(
              ':scope > [role="group"] > [role="treeitem"]',
            );
            focusItem(firstChild);
          }
          break;
        }
        case 'ArrowLeft': {
          const itemValue = current.getAttribute('data-value');
          const expanded = current.getAttribute('aria-expanded') === 'true';
          event.preventDefault();
          if (expanded && itemValue) {
            setExpandedValues((values) => (values ?? []).filter((v) => v !== itemValue));
          } else {
            const parent = current.parentElement?.closest<HTMLElement>('[role="treeitem"]');
            focusItem(parent);
          }
          break;
        }
        default: {
          if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
            window.clearTimeout(typeaheadTimer.current);
            typeaheadBuffer.current += event.key.toLowerCase();
            const buffer = typeaheadBuffer.current;
            typeaheadTimer.current = setTimeout(() => {
              typeaheadBuffer.current = '';
            }, TYPEAHEAD_RESET_MS);
            const match = items.find((item) =>
              item.textContent?.toLowerCase().trim().startsWith(buffer),
            );
            focusItem(match);
          }
        }
      }
    };

    return (
      <TreeProvider
        scope={__scopeTree}
        isItemSelected={isItemSelected}
        onItemSelectedChange={onItemSelectedChange}
        isItemExpanded={(value) => (expandedValues ?? []).includes(value)}
        onItemExpandedChange={(value, expanded) =>
          setExpandedValues((values) => {
            const currentValues = values ?? [];
            return expanded
              ? [...currentValues, value]
              : currentValues.filter((v) => v !== value);
          })
        }
        activeValue={activeValue}
        setActiveValue={setExplicitActiveValue}
        registerItem={registerItem}
        disabled={disabled}
      >
        <Primitive
          as="ul"
          role="tree"
          data-disabled={disabled ? '' : undefined}
          {...rootProps}
          ref={composedRef}
          onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        />
      </TreeProvider>
    );
  },
);

TreeImpl.displayName = 'TreeImpl';

export { Tree };
export type { TreeProps, TreeSingleProps, TreeMultipleProps };
