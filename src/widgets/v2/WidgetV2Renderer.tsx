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
  '001': dynamic(() => import('./widget-001')),
  '002': dynamic(() => import('./widget-002')),
  '003': dynamic(() => import('./widget-003')),
  '004': dynamic(() => import('./widget-004')),
  '005': dynamic(() => import('./widget-005')),
  '006': dynamic(() => import('./widget-006')),
  '007': dynamic(() => import('./widget-007')),
  '008': dynamic(() => import('./widget-008')),
  '009': dynamic(() => import('./widget-009')),
};

interface Props extends WidgetProps {
  widgetId: string;
}

export default function WidgetV2Renderer({ widgetId, ...props }: Props) {
  const Widget = widgetMap[widgetId];
  if (!Widget) return null;
  return <Widget {...props} />;
}
