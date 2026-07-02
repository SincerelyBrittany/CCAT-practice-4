// SVG-based renderer for spatial reasoning questions

const COLORS = { filled: "#6366F1", stroke: "#4F46E5", unfilled: "white" };

function Shape({ type, x, y, size = 40, filled = true, rotation = 0 }) {
  const s = size / 2;
  const cx = x + s;
  const cy = y + s;
  const fill = filled ? COLORS.filled : COLORS.unfilled;
  const transform = rotation ? `rotate(${rotation}, ${cx}, ${cy})` : undefined;

  if (type === "circle") return <circle cx={cx} cy={cy} r={s - 4} fill={fill} stroke={COLORS.stroke} strokeWidth="2" transform={transform} />;
  if (type === "square") return <rect x={x + 4} y={y + 4} width={size - 8} height={size - 8} fill={fill} stroke={COLORS.stroke} strokeWidth="2" transform={transform} />;
  if (type === "triangle") {
    const pts = `${cx},${y + 4} ${x + 4},${y + size - 4} ${x + size - 4},${y + size - 4}`;
    return <polygon points={pts} fill={fill} stroke={COLORS.stroke} strokeWidth="2" transform={transform} />;
  }
  if (type === "diamond") {
    const pts = `${cx},${y + 4} ${x + size - 4},${cy} ${cx},${y + size - 4} ${x + 4},${cy}`;
    return <polygon points={pts} fill={fill} stroke={COLORS.stroke} strokeWidth="2" />;
  }
  if (type === "pentagon") {
    const angles = [270, 342, 54, 126, 198].map(a => (a * Math.PI) / 180);
    const pts = angles.map(a => `${cx + (s - 4) * Math.cos(a)},${cy + (s - 4) * Math.sin(a)}`).join(" ");
    return <polygon points={pts} fill={fill} stroke={COLORS.stroke} strokeWidth="2" />;
  }
  if (type === "hexagon") {
    const angles = [0, 60, 120, 180, 240, 300].map(a => (a * Math.PI) / 180);
    const pts = angles.map(a => `${cx + (s - 4) * Math.cos(a)},${cy + (s - 4) * Math.sin(a)}`).join(" ");
    return <polygon points={pts} fill={fill} stroke={COLORS.stroke} strokeWidth="2" />;
  }
  if (type === "arrow_up") return <polygon points={`${cx},${y+4} ${x+4},${cy} ${x+14},${cy} ${x+14},${y+size-4} ${x+size-14},${y+size-4} ${x+size-14},${cy} ${x+size-4},${cy}`} fill={fill} stroke={COLORS.stroke} strokeWidth="2" />;
  if (type === "arrow_right") return <polygon points={`${x+4},${y+14} ${x+4},${y+size-14} ${cx},${y+size-14} ${cx},${y+size-4} ${x+size-4},${cy} ${cx},${y+4} ${cx},${y+14}`} fill={fill} stroke={COLORS.stroke} strokeWidth="2" />;
  if (type === "arrow_down") return <polygon points={`${cx},${y+size-4} ${x+4},${cy} ${x+14},${cy} ${x+14},${y+4} ${x+size-14},${y+4} ${x+size-14},${cy} ${x+size-4},${cy}`} fill={fill} stroke={COLORS.stroke} strokeWidth="2" />;
  if (type === "arrow_left") return <polygon points={`${x+size-4},${y+14} ${x+size-4},${y+size-14} ${cx},${y+size-14} ${cx},${y+size-4} ${x+4},${cy} ${cx},${y+4} ${cx},${y+14}`} fill={fill} stroke={COLORS.stroke} strokeWidth="2" />;
  if (type === "double_arrow") return (
    <>
      <polygon points={`${cx},${y+4} ${x+4},${cy} ${cx},${y+size-4} ${x+size-4},${cy}`} fill={fill} stroke={COLORS.stroke} strokeWidth="2" />
    </>
  );
  return null;
}

function DotShape({ x, y, size = 40, dotCount = 1 }) {
  const s = size / 2;
  const cx = x + s;
  const cy = y + s;
  const positions = [];
  if (dotCount === 1) positions.push([cx, cy]);
  if (dotCount === 2) { positions.push([cx - 8, cy]); positions.push([cx + 8, cy]); }
  if (dotCount === 3) { positions.push([cx, cy - 8]); positions.push([cx - 8, cy + 6]); positions.push([cx + 8, cy + 6]); }
  if (dotCount >= 4) {
    positions.push([cx - 8, cy - 8]); positions.push([cx + 8, cy - 8]);
    positions.push([cx - 8, cy + 8]); positions.push([cx + 8, cy + 8]);
    if (dotCount === 5) positions.push([cx, cy]);
  }
  return (
    <>
      <rect x={x + 2} y={y + 2} width={size - 4} height={size - 4} fill="white" stroke={COLORS.stroke} strokeWidth="2" rx="4" />
      {positions.slice(0, dotCount).map(([dx, dy], i) => (
        <circle key={i} cx={dx} cy={dy} r={5} fill={COLORS.filled} />
      ))}
    </>
  );
}

export default function SpatialQuestion({ visual }) {
  if (!visual) return null;

  const W = 280;
  const H = 120;
  const SZ = 44;
  const GAP = 8;

  // Matrix shape rotation: 3x3 grid with shape names
  if (visual.type === "matrix_shape_rotation") {
    const shapes = visual.grid;
    const cellW = SZ + GAP;
    const svgW = cellW * 3 + 20;
    const svgH = cellW * 3 + 20;
    return (
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto my-2">
        {shapes.map((shape, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 10 + col * cellW;
          const y = 10 + row * cellW;
          if (shape === "?") {
            return (
              <g key={i}>
                <rect x={x} y={y} width={SZ} height={SZ} fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4" />
                <text x={x + SZ / 2} y={y + SZ / 2 + 5} textAnchor="middle" fontSize="18" fill="#9CA3AF">?</text>
              </g>
            );
          }
          return <Shape key={i} type={shape} x={x} y={y} size={SZ} filled />;
        })}
      </svg>
    );
  }

  // Odd one out: render shapes labeled A-E
  if (visual.type === "odd_one_out") {
    const { shapes } = visual;
    const labels = ["A", "B", "C", "D", "E"];
    const cellW = SZ + GAP + 10;
    const svgW = cellW * shapes.length + 20;
    const svgH = SZ + 50;
    const typeMap = { 3: "triangle", 4: "square", 5: "pentagon", 6: "hexagon" };
    return (
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto my-2">
        {shapes.map((s, i) => {
          const x = 10 + i * cellW;
          return (
            <g key={i}>
              <Shape type={typeMap[s.sides] || "square"} x={x} y={10} size={SZ} filled={s.filled} />
              <text x={x + SZ / 2} y={SZ + 30} textAnchor="middle" fontSize="13" fill="#6B7280">{labels[i]}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  // Odd one out: arrows
  if (visual.type === "odd_one_out_rotation") {
    const { shapes } = visual;
    const labels = ["A", "B", "C", "D", "E"];
    const cellW = SZ + GAP + 10;
    const svgW = cellW * shapes.length + 20;
    const svgH = SZ + 50;
    return (
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto my-2">
        {shapes.map((s, i) => (
          <g key={i}>
            <Shape type={s} x={10 + i * cellW} y={10} size={SZ} filled />
            <text x={10 + i * cellW + SZ / 2} y={SZ + 30} textAnchor="middle" fontSize="13" fill="#6B7280">{labels[i]}</text>
          </g>
        ))}
      </svg>
    );
  }

  // Rotation series
  if (visual.type === "rotation_series") {
    const steps = [0, 45, 90, 135];
    const svgW = (SZ + GAP + 10) * 4 + 20;
    const svgH = SZ + 30;
    return (
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto my-2">
        {steps.map((deg, i) => (
          <Shape key={i} type="square" x={10 + i * (SZ + GAP + 10)} y={5} size={SZ} filled rotation={deg} />
        ))}
        <rect x={10 + 3 * (SZ + GAP + 10)} y={5} width={SZ} height={SZ} fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4" />
        <text x={10 + 3 * (SZ + GAP + 10) + SZ / 2} y={5 + SZ / 2 + 5} textAnchor="middle" fontSize="18" fill="#9CA3AF">?</text>
      </svg>
    );
  }

  // Dot series
  if (visual.type === "dot_series") {
    const counts = [1, 2, 3, 4];
    const svgW = (SZ + GAP + 10) * 4 + 80;
    const svgH = SZ + 30;
    return (
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto my-2">
        {counts.map((n, i) => (
          <DotShape key={i} x={10 + i * (SZ + GAP + 10)} y={5} size={SZ} dotCount={n} />
        ))}
        <rect x={10 + 4 * (SZ + GAP + 10)} y={5} width={SZ} height={SZ} fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4" rx="4" />
        <text x={10 + 4 * (SZ + GAP + 10) + SZ / 2} y={5 + SZ / 2 + 5} textAnchor="middle" fontSize="18" fill="#9CA3AF">?</text>
      </svg>
    );
  }

  // Flip series
  if (visual.type === "flip_series") {
    const states = ["up", "down", "up", "down"];
    const svgW = (SZ + GAP + 10) * 4 + 80;
    const svgH = SZ + 30;
    const triPts = (x, y, dir) => {
      const s = SZ - 8;
      const cx = x + SZ / 2;
      if (dir === "up") return `${cx},${y + 4} ${x + 4},${y + s + 4} ${x + s + 4},${y + s + 4}`;
      return `${cx},${y + s + 4} ${x + 4},${y + 4} ${x + s + 4},${y + 4}`;
    };
    return (
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto my-2">
        {states.map((dir, i) => (
          <polygon key={i} points={triPts(10 + i * (SZ + GAP + 10), 5, dir)} fill={COLORS.filled} stroke={COLORS.stroke} strokeWidth="2" />
        ))}
        <rect x={10 + 4 * (SZ + GAP + 10)} y={5} width={SZ} height={SZ} fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4" />
        <text x={10 + 4 * (SZ + GAP + 10) + SZ / 2} y={5 + SZ / 2 + 5} textAnchor="middle" fontSize="18" fill="#9CA3AF">?</text>
      </svg>
    );
  }

  // Overlay matrix
  if (visual.type === "overlay_matrix") {
    const { rows } = visual;
    const svgW = (SZ + GAP) * 3 + 20;
    const svgH = (SZ + GAP + 10) * 3 + 10;
    const shapeMap = {
      triangle: "triangle", square: "square", circle: "circle",
      triangle_square: ["triangle", "square"],
      circle_triangle: ["circle", "triangle"],
      "?": "?"
    };
    return (
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mx-auto my-2">
        {rows.map((row, ri) => row.map((cell, ci) => {
          const x = 10 + ci * (SZ + GAP);
          const y = 10 + ri * (SZ + GAP + 10);
          if (cell === "?") return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width={SZ} height={SZ} fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4" />
              <text x={x + SZ / 2} y={y + SZ / 2 + 5} textAnchor="middle" fontSize="18" fill="#9CA3AF">?</text>
            </g>
          );
          const s = shapeMap[cell];
          if (Array.isArray(s)) {
            return (
              <g key={`${ri}-${ci}`}>
                <Shape type={s[0]} x={x} y={y} size={SZ} filled />
                <Shape type={s[1]} x={x + 8} y={y + 8} size={SZ - 16} filled={false} />
              </g>
            );
          }
          return <Shape key={`${ri}-${ci}`} type={s} x={x} y={y} size={SZ} filled />;
        }))}
      </svg>
    );
  }

  return <div className="text-sm text-gray-400 italic my-2">[Visual pattern — see question text]</div>;
}
