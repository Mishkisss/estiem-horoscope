type Point = [number, number];
type ConstellationMap = { points: Point[]; edges: [number, number][] };

const MAPS: Record<string, ConstellationMap> = {
  aries: {
    points: [[88, 161], [143, 128], [197, 109], [254, 124]],
    edges: [[0, 1], [1, 2], [2, 3]],
  },
  taurus: {
    points: [[124, 151], [190, 82], [257, 151], [190, 218]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  gemini: {
    points: [[140, 76], [145, 117], [151, 164], [157, 211], [221, 76], [226, 119], [232, 165], [238, 211], [145, 117], [226, 119]],
    edges: [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [1, 8], [8, 9]],
  },
  cancer: {
    points: [[190, 77], [190, 123], [190, 169], [190, 218], [143, 128], [237, 128]],
    edges: [[0, 1], [1, 2], [2, 3], [1, 4], [1, 5]],
  },
  leo: {
    points: [[119, 104], [145, 82], [174, 88], [191, 115], [180, 147], [153, 163], [181, 177], [224, 196], [266, 177], [248, 142]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 6], [6, 7], [7, 8], [8, 9], [9, 6]],
  },
  virgo: {
    points: [[94, 125], [128, 101], [165, 91], [203, 107], [230, 139], [245, 177], [219, 204], [183, 190], [150, 166], [230, 139], [278, 91]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [4, 9], [9, 10]],
  },
  libra: {
    points: [[190, 91], [127, 151], [190, 211], [253, 151]],
    edges: [[0, 1], [0, 3], [1, 2], [3, 2]],
  },
  scorpio: {
    points: [[95, 190], [123, 145], [165, 112], [204, 111], [242, 148], [273, 193], [235, 212], [193, 196]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
  },
  sagittarius: {
    points: [[98, 170], [136, 117], [184, 84], [229, 110], [266, 152], [224, 188], [177, 173], [137, 199], [170, 227]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [6, 7], [7, 8]],
  },
  capricorn: {
    points: [[103, 172], [132, 135], [166, 111], [199, 126], [231, 95], [267, 119], [285, 158], [255, 188], [218, 177], [183, 193], [166, 111]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 3]],
  },
  aquarius: {
    points: [[83, 120], [126, 148], [169, 118], [211, 150], [254, 121], [295, 150], [253, 180], [210, 151], [167, 182], [124, 155]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  },
  pisces: {
    points: [[108, 89], [144, 111], [151, 150], [136, 186], [103, 201], [86, 169], [98, 130], [151, 150], [211, 150], [245, 119], [278, 104], [294, 136], [282, 173], [249, 194], [216, 180], [211, 150]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [2, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 8]],
  },
};

function sparklePath(size: number) {
  return `M0 ${-size}C${size * 0.15} ${-size * 0.15} ${size * 0.15} ${-size * 0.15} ${size} 0C${size * 0.15} ${size * 0.15} ${size * 0.15} ${size * 0.15} 0 ${size}C${-size * 0.15} ${size * 0.15} ${-size * 0.15} ${size * 0.15} ${-size} 0C${-size * 0.15} ${-size * 0.15} ${-size * 0.15} ${-size * 0.15} 0 ${-size}Z`;
}

export function Constellation({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const constellation = MAPS[slug] ?? MAPS.aries!;
  const id = slug.replace(/[^a-z0-9-]/gi, "");
  const chartGradient = `chart-bg-${id}`;
  const starGlow = `star-glow-${id}`;
  const center = { x: 190, y: 150 };
  const outerRadius = 133;
  const compassStars = Array.from({ length: 24 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 24 - Math.PI / 2;
    return {
      x: center.x + Math.cos(angle) * (i % 2 === 0 ? 116 : 128),
      y: center.y + Math.sin(angle) * (i % 2 === 0 ? 116 : 128),
      size: i % 3 === 0 ? 2.4 : 1.5,
      rotate: i * 15,
    };
  });

  return (
    <svg
      viewBox="0 0 380 300"
      className={className}
      fill="none"
      role="img"
      aria-label={`${slug} constellation`}
    >
      <defs>
        <radialGradient id={chartGradient} cx="50%" cy="48%" r="72%">
          <stop stopColor="#286449" />
          <stop offset="0.68" stopColor="#1B503A" />
          <stop offset="1" stopColor="#123F2F" />
        </radialGradient>
        <filter id={starGlow} x="-300%" y="-300%" width="700%" height="700%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#FFD85C" floodOpacity="0.85" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={`chart-clip-${id}`}>
          <rect x="5" y="5" width="370" height="290" rx="28" />
        </clipPath>
      </defs>

      <rect x="5" y="5" width="370" height="290" rx="28" fill={`url(#${chartGradient})`} stroke="#D9C65B" strokeWidth="1.25" />
      <g clipPath={`url(#chart-clip-${id})`}>
        <g stroke="#D9C65B" strokeOpacity="0.34" strokeWidth="0.8">
          <circle cx={center.x} cy={center.y} r="46" />
          <circle cx={center.x} cy={center.y} r="91" />
          <circle cx={center.x} cy={center.y} r={outerRadius} />
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 12;
            const x = center.x + Math.cos(angle) * outerRadius;
            const y = center.y + Math.sin(angle) * outerRadius;
            return <line key={i} x1={center.x} y1={center.y} x2={x} y2={y} />;
          })}
        </g>

        <g fill="#D9C65B" opacity="0.68">
          {compassStars.map((star, i) => (
            <path
              key={i}
              d={sparklePath(star.size)}
              transform={`translate(${star.x} ${star.y}) rotate(${star.rotate})`}
            />
          ))}
        </g>

        <g stroke="#F6CF50" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round">
          {constellation.edges.map(([from, to]) => {
            const [x1, y1] = constellation.points[from]!;
            const [x2, y2] = constellation.points[to]!;
            return <line key={`glow-${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
        <g stroke="#F4D355" strokeOpacity="0.82" strokeWidth="1.05" strokeLinecap="round">
          {constellation.edges.map(([from, to]) => {
            const [x1, y1] = constellation.points[from]!;
            const [x2, y2] = constellation.points[to]!;
            return <line key={`${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {constellation.points.map(([x, y], i) => (
          <g key={`${x}-${y}-${i}`} transform={`translate(${x} ${y})`} filter={`url(#${starGlow})`}>
            <path d={sparklePath(i % 3 === 0 ? 6.4 : 4.8)} fill="#FFE66D" />
            <circle r="1.2" fill="#FFF8C9" />
          </g>
        ))}
      </g>
    </svg>
  );
}
