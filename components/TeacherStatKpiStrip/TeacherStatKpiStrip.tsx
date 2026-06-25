import type { TeacherKpi } from "@/lib/dashboard/teacher-data";
import { TeacherStatKpiCard } from "@/components/TeacherStatKpiCard/TeacherStatKpiCard";

type TeacherStatKpiStripProps = {
  readonly items: ReadonlyArray<TeacherKpi>;
};

// 4-up on desktop, 2-up on tablet, 1-up on mobile.
export function TeacherStatKpiStrip({ items }: TeacherStatKpiStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <TeacherStatKpiCard key={item.label} item={item} />
      ))}
    </div>
  );
}

export default TeacherStatKpiStrip;
