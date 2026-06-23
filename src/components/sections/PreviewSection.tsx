import styles from "./PreviewSection.module.css";

interface PreviewSectionProps {
  widgetPreview: React.ReactNode;
  applicationNumber: number;
  widgetId: string;
}

export default function PreviewSection({ widgetPreview, widgetId }: PreviewSectionProps) {
  const scaled = widgetId !== "006";

  return (
    <div className={styles.container}>
      <div className={styles.widgetPanel} onClick={(e) => e.preventDefault()}>
        <div className={scaled ? styles.widgetScaled : undefined}>
          {widgetPreview}
        </div>
      </div>
    </div>
  );
}
