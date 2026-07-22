import HeaderTag from './HeaderTag';
import styles from './StackedTag.module.css';

type StackedTagColor = 'yellow' | 'purple' | 'green' | 'blue' | 'pink';

interface StackedTagProps {
  topLabel: string;
  bottomLabel: string;
  color?: StackedTagColor;
  align?: 'start' | 'end';
}

export default function StackedTag({ topLabel, bottomLabel, color = 'yellow', align = 'start' }: StackedTagProps) {
  return (
    <div className={`${styles.stack} ${align === 'end' ? styles.alignEnd : styles.alignStart}`}>
      <HeaderTag label={topLabel} color={color} />
      <HeaderTag label={bottomLabel} color={color} />
    </div>
  );
}
