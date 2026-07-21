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
];
