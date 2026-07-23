'use client';

import { usePendingApprovalPoll } from './usePendingApprovalPoll';

// Renders nothing — the widget itself already looks right pre-approval
// (see EmbedFrame's pointer-events:none). This just keeps polling for
// approval so members/pending/{slug}.md gets cleaned up once merged,
// same as WidgetPending does for the no-widget-selected case.
export default function PendingApprovalSync({ slug }: { slug: string }) {
  usePendingApprovalPoll(slug);
  return null;
}
