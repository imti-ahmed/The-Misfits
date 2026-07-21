export interface WidgetV2Config {
  id: string;
  label: string;
  defaultBgColor: string;
  defaultTextColor: string;
}

export const widgetV2Registry: WidgetV2Config[] = [
  {
    id: '001',
    label: 'Blue Stamp',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
  {
    id: '002',
    label: 'Stacked Bar',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
  {
    id: '003',
    label: 'Compact Stacked Bar',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
  {
    id: '004',
    label: 'Bar + Icon Pill',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
  {
    id: '005',
    label: 'Stacked Bar (Reversed)',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
  {
    id: '006',
    label: 'Bar + Icon Pill (Reversed)',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
  {
    id: '007',
    label: 'Minimal + Icon Pill',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
  {
    id: '008',
    label: 'Label + Split Row',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
  {
    id: '009',
    label: 'Identity + Icon Pill',
    defaultBgColor: '#356aff',
    defaultTextColor: '#ffffff',
  },
];
