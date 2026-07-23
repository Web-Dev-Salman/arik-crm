import { requireStaff } from "@/lib/guards";
import { listContacts } from "@/modules/contacts/service";
import { listContactsQuerySchema } from "@/modules/contacts/schema";
import { ContactsClient } from "@/components/contacts/contacts-client";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  await requireStaff();
  const sp = await searchParams;
  const query = listContactsQuerySchema.parse(sp);   // same schema as the API — one source of truth
  const { items, meta } = await listContacts(query);

  return (
    <ContactsClient
      initialItems={JSON.parse(JSON.stringify(items))}
      meta={meta}
      query={query}
    />
  );
}