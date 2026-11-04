import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function ProfileCard({ title, children, className }: Props) {
  return (
    <article className={`paper-card${className ? ` ${className}` : ""}`}>
      <h3>{title}</h3>
      {children}
    </article>
  );
}
