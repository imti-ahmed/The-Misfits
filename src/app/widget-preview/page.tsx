import HeaderTag from '@/components/HeaderTag';
import MarqueeTag from '@/components/MarqueeTag';
import NavTag from '@/components/NavTag';
import StackedTag from '@/components/StackedTag';
import LogoBox from '@/components/LogoBox';
import TaggedSection from '@/components/TaggedSection';

const SECTION_BODY =
  'List of active members. Everyone here is an utterly crazy and interesting person making or building cool shit. P.S. The order of the ring is randomized daily.';

const HEADER_TAG_COLORS = ['yellow', 'purple', 'green', 'blue', 'pink'] as const;

const MARQUEE_MESSAGES = [
  'welcome to the webring',
  'new member nolan c d has joined',
  'built & maintained by imtiyaz ahmed',
];

export default function ComponentPreview() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px', background: '#555', minHeight: '100vh' }}>
      <div>
        <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
          HeaderTag
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {HEADER_TAG_COLORS.map((color) => (
            <HeaderTag key={color} label="active member list" color={color} />
          ))}
        </div>
      </div>

      <div>
        <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
          MarqueeTag
        </p>
        <div style={{ width: '600px' }}>
          <MarqueeTag messages={MARQUEE_MESSAGES} />
        </div>
      </div>

      <div>
        <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
          HeaderTag (as Gallery Button — reused, not a new component)
        </p>
        <HeaderTag label="gallery >" color="yellow" />
      </div>

      <div>
        <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
          NavTag
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <NavTag label="prev >>" />
        </div>
      </div>

      <div>
        <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
          StackedTag
        </p>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <StackedTag topLabel="visit" bottomLabel="github >" color="yellow" align="start" />
          <StackedTag topLabel="active" bottomLabel="members:008" color="purple" align="end" />
          <StackedTag topLabel="click to" bottomLabel="join >>>" color="yellow" align="start" />
        </div>
      </div>

      <div>
        <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
          LogoBox
        </p>
        <LogoBox />
      </div>

      <div>
        <p style={{ color: '#ccc', fontSize: '11px', marginBottom: '8px', fontFamily: 'monospace' }}>
          TaggedSection (single / double content box)
        </p>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ width: '355.735px' }}>
            <TaggedSection headerLabel="active member list" content={[SECTION_BODY]} />
          </div>
          <div style={{ width: '355.735px' }}>
            <TaggedSection headerLabel="active member list" content={[SECTION_BODY, SECTION_BODY]} />
          </div>
        </div>
      </div>
    </div>
  );
}
