import { widgetRegistry } from '~/registry';
import WidgetRenderer from '@/widgets/WidgetRenderer';

export default function WidgetPreview() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px', background: '#555', minHeight: '100vh' }}>
      {widgetRegistry.map((widget) => (
        <div key={widget.id}>
          <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
            #{widget.id} — {widget.label} &nbsp;|&nbsp; bg: {widget.defaultBgColor} &nbsp;text: {widget.defaultTextColor}
          </p>
          <WidgetRenderer
            widgetId={widget.id}
            nickname="IMTI"
            slug="imti"
            bgColor={widget.defaultBgColor}
            textColor={widget.defaultTextColor}
          />
        </div>
      ))}
    </div>
  );
}
