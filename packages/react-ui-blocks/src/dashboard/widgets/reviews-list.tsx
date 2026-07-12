import { cn } from '@nebula/primitives/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@nebula/react-ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { List, ListItem } from '@nebula/react-ui/list';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface Review {
  id: string;
  author: string;
  avatarSrc?: string;
  /** 1-5, need not be a whole number (e.g. `4.5`). */
  rating: number;
  /** Pre-formatted by the consumer (e.g. `"2 days ago"`). */
  date?: React.ReactNode;
  content: React.ReactNode;
}

interface ReviewsListProps {
  title?: React.ReactNode;
  reviews: Review[];
  className?: string;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-3.5 w-3.5 text-[var(--color-warning)]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"
      />
    </svg>
  );
}

/**
 * A static (non-interactive) star rating display, `n` out of 5 filled
 * stars plus an `aria-label` announcing the number. Deliberately **not**
 * `react-ui`'s `Rating` — that component is a `role="radiogroup"` input
 * for *collecting* a rating; using it to merely *display* one would
 * announce a review's static score as an editable control to a screen
 * reader, which is wrong. This is the read-only counterpart, scoped to
 * this block since nothing else in the workspace needs a read-only star
 * display yet.
 */
function StaticRating({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} filled={index < rounded} />
      ))}
    </span>
  );
}

/**
 * An avatar + star rating + text reviews list — Minimals' Course/Product
 * review section (§3.12 Blog → *Comment Section* is the closest taxonomy
 * analog, though this is read-only with no reply/compose affordance a
 * comment section would have).
 *
 * @example
 * ```tsx
 * <ReviewsList
 *   title="Reviews"
 *   reviews={[
 *     { id: '1', author: 'Jane Cooper', rating: 5, date: '2 days ago', content: 'Great course, learned a lot!' },
 *   ]}
 * />
 * ```
 */
function ReviewsList(props: ReviewsListProps) {
  const { title, reviews, className } = props;

  return (
    <Card variant="outlined" className={cn('flex flex-col', className)}>
      {title ? (
        <CardHeader bordered={false}>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className={title ? 'pt-0' : undefined}>
        <List className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ListItem key={review.id} className="flex gap-3">
              <Avatar className="shrink-0">
                {review.avatarSrc ? <AvatarImage src={review.avatarSrc} alt="" /> : null}
                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Text className="text-sm font-medium">{review.author}</Text>
                  {review.date ? <Text className="text-xs opacity-70">{review.date}</Text> : null}
                </div>
                <StaticRating value={review.rating} />
                <Text className="text-sm opacity-90">{review.content}</Text>
              </div>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export { ReviewsList };
export type { ReviewsListProps, Review };
