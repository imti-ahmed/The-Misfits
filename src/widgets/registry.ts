export interface WidgetConfig {
  id: string;
  label: string;
  defaultBgColor: string;
  defaultTextColor: string;
}

export const widgetRegistry: WidgetConfig[] = [
  {
    id: '001',
    label: 'Classic Dark',
    defaultBgColor: '#000000',
    defaultTextColor: '#ffffff',
  },
  {
    id: '002',
    label: 'Classic Light',
    defaultBgColor: '#f8f8f8',
    defaultTextColor: '#000000',
  },
];
