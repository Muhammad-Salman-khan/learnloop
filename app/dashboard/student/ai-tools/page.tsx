import { notFound } from "next/navigation";

import { PagePlaceholder } from "@/components/PagePlaceholder/PagePlaceholder";
import { placeholderSpecs } from "@/lib/dashboard/placeholder-data";

const page = () => {
  const spec = placeholderSpecs["ai-tools"];
  if (!spec) notFound();
  return <PagePlaceholder {...spec} />;
};

export default page;
