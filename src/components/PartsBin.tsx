import { useEffect, useRef } from "react";
import rough from "roughjs";
import { site } from "../content/site";
import TrayIcon from "./TrayIcon";

function SkillTray({
  name,
  items,
  index,
}: {
  name: string;
  items: readonly string[];
  index: number;
}) {
  const trayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = trayRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const draw = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      if (width === 0 || height === 0) return;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const rc = rough.svg(svg);
      const rect = rc.rectangle(1, 1, width - 2, height - 2, {
        stroke: "#2b2b2b",
        strokeWidth: 1.4,
        roughness: 1.0,
        bowing: 0.2,
        fill: "#f3efe3",
        fillStyle: "solid",
        seed: 300 + index,
      });
      svg.replaceChildren(rect);
    };

    draw();

    const ro = new ResizeObserver(() => {
      draw();
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [index]);

  return (
    <div className="parts-tray" ref={trayRef}>
      <svg className="tray-canvas" ref={svgRef} aria-hidden="true" />
      <div className="tray-content">
        <div className="tray-header">
          <span className="tray-label">{name}</span>
          <TrayIcon index={index} />
        </div>
        <div className="tray-items">
          {items.map((item) => (
            <span className="part-strip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PartsBin() {
  const labels = site.content.labels;

  return (
    <div className="parts-bin">
      <h3>{labels.skills}</h3>
      <div className="parts-grid">
        {site.skillGroups.map((group, index) => (
          <SkillTray
            key={group.name}
            name={group.name}
            items={group.items}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
