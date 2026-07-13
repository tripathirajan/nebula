import { cn } from '@nebula/primitives/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@nebula/react-ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { List, ListItem } from '@nebula/react-ui/list';
import { StaticRating } from '@nebula/react-ui/static-rating';
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
