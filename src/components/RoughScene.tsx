import { useEffect, useRef } from "react";
import type { RoughSVG } from "roughjs/bin/svg";
import { site } from "../content/site";
import type { LabHost } from "../content/site";

type Props = {
  mode: "topology" | "tallies";
  counts?: number[];
  labels?: string[];
  label?: string;
  description?: string;
  hosts?: readonly LabHost[];
  domain?: string;
};

const colors = {
  ink: "#2b2b2b",
  paper: "#f3efe3",
  accent: "#1d3fb8",
  zone: "#e5dfcf",
  attacker: "#eee1d9",
};

export default function RoughScene({
  mode,
  counts = [],
  labels = [],
  label,
  description,
  hosts = [],
  domain = "",
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const drawn = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || drawn.current) return;
        drawn.current = true;
        void import("roughjs").then(({ default: rough }) => {
          const svg = svgRef.current;
          if (!svg) return;
          const generator = rough.svg(svg);
          if (mode === "topology") {
            drawTopology(svg, generator, hosts, domain);
          } else {
            drawTallies(svg, generator, counts, labels);
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [counts, domain, hosts, labels, mode]);

  const hostEntries = hosts.map((host) => ({
    label: host.id,
    os: host.os,
    roles: host.roles,
    zone: host.zone,
  }));

  return (
    <div className={`rough-scene rough-scene--${mode}`} ref={hostRef}>
      <svg
        ref={svgRef}
        viewBox={mode === "topology" ? "0 0 900 520" : `0 0 510 ${Math.max(150, labels.length * 58)}`}
        role="img"
        aria-label={label}
        aria-describedby={description ? "topology-description" : undefined}
        focusable="false"
      >
        {mode === "topology" && (
          <>
            <title>{label}</title>
            <desc id="topology-description">{description}</desc>
          </>
        )}
      </svg>
      {mode === "topology" && (
        <div className="topology-mobile">
          <h3>{site.content.labels.domainLabel}: {domain}</h3>
          <ul>
            {hostEntries.map((entry) => (
              <li key={entry.label}>
                <strong>{entry.label}</strong>
                {entry.os && <span>{entry.os}</span>}
                {entry.roles && <span>{entry.roles}</span>}
                <span>{entry.zone === "attacker" ? site.content.labels.attackerLabel : site.content.labels.hostOnly}</span>
              </li>
            ))}
            <li>
              <strong>{site.content.labels.switch}</strong>
              <span>{site.content.labels.hostOnly}</span>
            </li>
            <li>
              <strong>{site.content.labels.nat}</strong>
              <span>{site.content.labels.egress}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

const hostPositions = [
  { x: 235, y: 65 },
  { x: 35, y: 140 },
  { x: 35, y: 320 },
  { x: 440, y: 140 },
  { x: 440, y: 320 },
];
const hostWidth = 180;
const hostHeight = 68;
const switchBox = { x: 250, y: 226, w: 150, h: 68 };

function drawTopology(
  svg: SVGSVGElement,
  generator: RoughSVG,
  hosts: readonly LabHost[],
  domain: string,
) {
  const domainHosts = hosts.filter((host) => host.zone === "domain");
  const kaliHost = hosts.find((host) => host.zone === "attacker");
  const zoneOptions = { stroke: colors.ink, strokeWidth: 1, roughness: 0.5, bowing: 0.2 };
  svg.append(
    generator.rectangle(18, 48, 630, 438, {
      ...zoneOptions,
      fill: colors.zone,
      fillStyle: "solid",
      seed: 100,
    }),
    generator.rectangle(668, 48, 214, 438, {
      ...zoneOptions,
      fill: colors.attacker,
      fillStyle: "solid",
      seed: 101,
    }),
  );
  addText(svg, site.content.labels.domainLabel, 36, 78, "diagram-zone");
  addText(svg, site.content.labels.attackerLabel, 686, 78, "diagram-zone");
  if (domain) addText(svg, domain, 36, 99, "diagram-domain");

  domainHosts.forEach((_host, index) => {
    const position = hostPositions[index] ?? { x: 220, y: 105 + index * 82 };
    const centerX = position.x + hostWidth / 2;
    const centerY = position.y + hostHeight / 2;
    const switchCenterX = switchBox.x + switchBox.w / 2;
    const switchCenterY = switchBox.y + switchBox.h / 2;
    const start = edgePoint(centerX, centerY, switchCenterX, switchCenterY, hostWidth / 2, hostHeight / 2);
    const end = edgePoint(switchCenterX, switchCenterY, centerX, centerY, switchBox.w / 2, switchBox.h / 2);
    svg.append(
      generator.line(start.x, start.y, end.x, end.y, {
        stroke: colors.ink,
        strokeWidth: 1.5,
        roughness: 0.7,
        bowing: 0.25,
        seed: 110 + index,
      }),
    );
  });

  const kali = { x: 691, y: 232, w: 166, h: 68 };
  const nat = { x: 691, y: 112, w: 166, h: 68 };
  const switchRightX = switchBox.x + switchBox.w;
  svg.append(
    generator.path(
      `M ${switchRightX} ${switchBox.y + switchBox.h / 2} C 535 260, 610 266, ${kali.x} ${kali.y + kali.h / 2}`,
      { stroke: colors.ink, strokeWidth: 1.5, roughness: 0.7, bowing: 0.25, seed: 120 },
    ),
    generator.line(kali.x + kali.w / 2, kali.y, nat.x + nat.w / 2, nat.y + nat.h, {
      stroke: colors.accent,
      strokeWidth: 1.6,
      roughness: 0.7,
      bowing: 0.25,
      seed: 121,
    }),
  );
  svg.append(
    generator.rectangle(switchBox.x, switchBox.y, switchBox.w, switchBox.h, {
      stroke: colors.ink,
      strokeWidth: 1.8,
      roughness: 0.7,
      bowing: 0.3,
      fill: colors.paper,
      fillStyle: "solid",
      seed: 130,
    }),
    generator.rectangle(kali.x, kali.y, kali.w, kali.h, {
      stroke: colors.ink,
      strokeWidth: 1.8,
      roughness: 0.7,
      bowing: 0.3,
      fill: colors.paper,
      fillStyle: "solid",
      seed: 131,
    }),
    generator.rectangle(nat.x, nat.y, nat.w, nat.h, {
      stroke: colors.accent,
      strokeWidth: 1.6,
      roughness: 0.7,
      bowing: 0.3,
      fill: colors.paper,
      fillStyle: "solid",
      seed: 132,
    }),
  );
  addText(svg, site.content.labels.switch, switchBox.x + switchBox.w / 2, switchBox.y + 40, "diagram-node");
  addText(svg, kaliHost?.id ?? site.content.labels.attackerLabel, kali.x + kali.w / 2, kali.y + 30, "diagram-node");
  addText(svg, site.content.labels.nat, nat.x + nat.w / 2, nat.y + 30, "diagram-node");
  addText(svg, site.content.labels.egress, nat.x + nat.w / 2, nat.y + nat.h + 18, "diagram-note");
  addText(svg, site.content.labels.attackNote, kali.x + kali.w / 2, kali.y + kali.h + 18, "diagram-note");

  domainHosts.forEach((host, index) => {
    const position = hostPositions[index] ?? { x: 220, y: 105 + index * 82 };
    svg.append(
      generator.rectangle(position.x, position.y, hostWidth, hostHeight, {
        stroke: colors.ink,
        strokeWidth: 1.6,
        roughness: 0.7,
        bowing: 0.3,
        fill: colors.paper,
        fillStyle: "solid",
        seed: 140 + index,
      }),
    );
    addText(svg, host.id, position.x + hostWidth / 2, position.y + 21, "diagram-host");
    addText(svg, host.os, position.x + hostWidth / 2, position.y + 39, "diagram-host-detail");
    addText(svg, host.roles, position.x + hostWidth / 2, position.y + 54, "diagram-host-detail");
  });
  animatePaths(svg);
}

function edgePoint(
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  halfWidth: number,
  halfHeight: number,
) {
  const dx = targetX - x;
  const dy = targetY - y;
  const scale = 1 / Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight);
  return { x: x + dx * scale, y: y + dy * scale };
}

function addText(svg: SVGSVGElement, value: string, x: number, y: number, className: string) {
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", String(x));
  text.setAttribute("y", String(y));
  text.setAttribute("class", className);
  text.textContent = value;
  svg.append(text);
}

function drawTallies(
  svg: SVGSVGElement,
  generator: RoughSVG,
  counts: number[],
  labels: string[],
) {
  labels.forEach((entry, index) => {
    const y = 28 + index * 58;
    const count = counts[index] ?? 0;
    const marks = Math.min(count, 25);
    const groups = Math.floor(marks / 5);
    const remainder = marks % 5;
    for (let group = 0; group < groups; group += 1) {
      const x = 8 + group * 42;
      for (let stroke = 0; stroke < 4; stroke += 1) {
        svg.append(
          generator.line(x + stroke * 7, y, x + stroke * 7, y + 23, {
            stroke: colors.accent,
            strokeWidth: 2,
            roughness: 0.8,
            bowing: 0.4,
            seed: index * 100 + group * 10 + stroke + 1,
          }),
        );
      }
      svg.append(
        generator.line(x - 2, y + 22, x + 25, y + 2, {
          stroke: colors.accent,
          strokeWidth: 2,
          roughness: 0.8,
          bowing: 0.4,
          seed: index * 100 + group * 10 + 5,
        }),
      );
    }
    const remainderX = 8 + groups * 42;
    for (let stroke = 0; stroke < remainder; stroke += 1) {
      svg.append(
        generator.line(remainderX + stroke * 7, y, remainderX + stroke * 7, y + 23, {
          stroke: colors.accent,
          strokeWidth: 2,
          roughness: 0.8,
          bowing: 0.4,
          seed: index * 100 + groups * 10 + stroke + 6,
        }),
      );
    }
    addText(svg, `${entry} · ${count}`, 225, y + 18, "tally-label");
  });
  animatePaths(svg);
}

function animatePaths(svg: SVGSVGElement) {
  svg.querySelectorAll("path").forEach((path, index) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    path.style.transitionDelay = `${Math.min(index * 20, 500)}ms`;
    requestAnimationFrame(() => {
      path.classList.add("drawn");
      path.style.strokeDashoffset = "0";
    });
  });
}
