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
  {
    id: '003',
    label: 'Chain Badge',
    defaultBgColor: '#ffffff',
    defaultTextColor: '#000000',
  },
  {
    id: '004',
    label: 'Pill Badge',
    defaultBgColor: '#ffffff',
    defaultTextColor: '#000000',
  },
  {
    id: '005',
    label: 'Green Tag',
    defaultBgColor: '#6af58c',
    defaultTextColor: '#000000',
  },
  {
    id: '006',
    label: 'Dark Bar',
    defaultBgColor: '#18181b',
    defaultTextColor: '#f4f4f5',
  },
  {
    id: '007',
    label: 'Blue Button',
    defaultBgColor: '#1348dc',
    defaultTextColor: '#ffffff',
  },
  {
    id: '008',
    label: 'Retro Terminal',
    defaultBgColor: '#faf9f5',
    defaultTextColor: '#282828',
  },
  {
    id: '009',
    label: 'Dark Terminal',
    defaultBgColor: '#242424',
    defaultTextColor: '#f2f2f2',
  },
  {
    id: '010',
    label: 'Dashed Minimal',
    defaultBgColor: 'transparent',
    defaultTextColor: '#7c7c7c',
  },
];
