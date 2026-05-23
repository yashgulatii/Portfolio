import { useTryHackMe } from '../../hooks/useTryHackMe';
import StatCard from '../ui/StatCard';

export default function Stats() {
  const { stats } = useTryHackMe();

  return (
    <section className="bg-bg-secondary border-y border-border py-12">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/0 md:divide-border/50">
          <StatCard value={stats.rank} label="TryHackMe Global Rank" isString={true} />
          <StatCard value="7" label="Security Tools Built" />
          <StatCard value={stats.roomsCompleted.toString()} label="Rooms Completed" isString={true} />
          <StatCard value="100+" label="Beta Users — Campus Track" />
        </div>
      </div>
    </section>
  );
}
