import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_URL } from '@/config/site';

export const alt = `${SITE_NAME} - free baby-led weaning 30-day plan and allergen tracker`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TAGS = ['30-day plan', 'Allergen tracking', 'Printable checklist'];

// Lucide "broccoli" paths, inlined because lucide-react icons are client components.
const BROCCOLI_PATHS = [
  'M10 13a3 3 0 0 1-2.121-5.121',
  'M15.606 14.204c-3.5 1.5-5.899 4.503-8.899 7.503A1 1 0 0 1 6 22c-2 0-4-2-4-4a1 1 0 0 1 .293-.707c1.911-1.911 3.823-3.578 5.347-5.441',
  'M16.573 14.737A4 4 0 0 1 14 11',
  'M7.14 10.907a4 4 0 1 1 2.756-7.43A4 4 0 0 1 16.7 4.48a2 2 0 0 1 2.82 2.82 4 4 0 0 1 1.002 6.805A4 4 0 1 1 13 16',
];

export default function Image() {
  const domain = SITE_URL.replace('https://', '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#ecfdf5',
          color: '#1a3d27',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 88,
                height: 88,
                borderRadius: 24,
                background: '#4a7c59',
              }}>
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ecfdf5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                {BROCCOLI_PATHS.map((d) => (
                  <path key={d} d={d} />
                ))}
              </svg>
            </div>
            <div style={{ display: 'flex', fontSize: 38, color: '#4a7c59' }}>{SITE_NAME}</div>
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: '#4a7c59' }}>{domain}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 84, lineHeight: 1.05 }}>
            BLW, planned for you
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#334155' }}>
            Check readiness, then get a personalised 30-day solids plan.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {TAGS.map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                padding: '12px 24px',
                borderRadius: 999,
                background: '#4a7c59',
                fontSize: 28,
                color: '#ecfdf5',
              }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
