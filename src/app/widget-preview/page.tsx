import { widgetV2Registry } from '@/widgets/v2/registry';
import WidgetV2Renderer from '@/widgets/v2/WidgetV2Renderer';

export default function WidgetV2Preview() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px', background: '#555', minHeight: '100vh' }}>
      {widgetV2Registry.map((widget) => (
        <div key={widget.id}>
          <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
            #{widget.id} — {widget.label} &nbsp;|&nbsp; bg: {widget.defaultBgColor} &nbsp;text: {widget.defaultTextColor}
          </p>
          <WidgetV2Renderer
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
