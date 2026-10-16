import { getUsers } from './index';

/** Resolve an exact email match; a transaction row ID is never a user ID. */
export async function resolveUserIdByEmail(email: string): Promise<string> {
  let currentPage = 1;
  let totalPages = 1;
  do {
    const data = await getUsers({ currentPage, limit: 100, search: email });
    const users: { id?: string | number; email?: string }[] = data?.users ?? [];
    const matches = users.filter(user => user.email?.trim().toLowerCase() === email.trim().toLowerCase());
    if (matches.length === 1 && matches[0].id != null && String(matches[0].id)) {
      return String(matches[0].id);
    }
    if (matches.length > 1) throw new Error('Multiple users match this email.');
    totalPages = Number(data?.totalPages ?? 1);
    currentPage++;
  } while (currentPage <= totalPages);
  throw new Error('No user profile was found for this email.');
}
