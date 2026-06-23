import type { StudentKpi } from "@/lib/dashboard/student-data";

import { StatKpi } from "@/components/StatKpi/StatKpi";

type StatKpiStripProps = {
  readonly items: ReadonlyArray<StudentKpi>;
};

// 4-up strip on desktop, 2-up on tablet, 1-up on mobile.
// Uses CSS Grid (per AGENTS rule 3.E) so there's no flexbox percentage math.
export function StatKpiStrip({ items }: StatKpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatKpi key={item.label} {...item} />
      ))}
    </div>
  );
}

export default StatKpiStrip;
