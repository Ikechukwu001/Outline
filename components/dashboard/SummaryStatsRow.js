import SummaryStatCard from "@/components/dashboard/SummaryStatCard";

export default function SummaryStatsRow({ stats }) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <SummaryStatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          type={stat.type}
        />
      ))}
    </section>
  );
}