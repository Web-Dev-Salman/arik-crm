import { requireStaff } from "@/lib/guards";
import { listCases } from "@/modules/cases/service";
import { listCasesQuerySchema } from "@/modules/cases/schema";
import { listContacts } from "@/modules/contacts/service";
import { CasesClient } from "@/components/cases/cases-client";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireStaff();
  const sp = await searchParams;
  const query = listCasesQuerySchema.parse(sp);
  const { items, meta } = await listCases(query);
  // Contacts for the "new case" picker (first 100 is fine for now)
  const { items: contacts } = await listContacts({ page: 1, limit: 100 });

  return (
    <CasesClient
      initialItems={JSON.parse(JSON.stringify(items))}
      contacts={JSON.parse(JSON.stringify(contacts))}
      meta={meta}
      query={query}
    />
  );
}