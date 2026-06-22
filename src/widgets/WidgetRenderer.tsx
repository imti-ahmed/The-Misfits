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
  '003': dynamic(() => import('./Widget003')),
  '004': dynamic(() => import('./Widget004')),
  '005': dynamic(() => import('./Widget005')),
  '006': dynamic(() => import('./Widget006')),
  '007': dynamic(() => import('./Widget007')),
  '008': dynamic(() => import('./Widget008')),
  '009': dynamic(() => import('./Widget009')),
  '010': dynamic(() => import('./Widget010')),
};

interface Props extends WidgetProps {
  widgetId: string;
}

export default function WidgetRenderer({ widgetId, ...props }: Props) {
  const Widget = widgetMap[widgetId];
  if (!Widget) return null;
  return <Widget {...props} />;
}
