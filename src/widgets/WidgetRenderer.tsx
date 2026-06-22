'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

interface WidgetProps {
  nickname: string;
  slug: string;
  bgColor?: string;
  textColor?: string;
}

const widgetMap: Record<string, ComponentType<WidgetProps>> = {
  '001': dynamic(() => import('./Widget001')),
  '002': dynamic(() => import('./Widget002')),
};

interface Props extends WidgetProps {
  widgetId: string;
}

export default function WidgetRenderer({ widgetId, ...props }: Props) {
  const Widget = widgetMap[widgetId];
  if (!Widget) return null;
  return <Widget {...props} />;
}
