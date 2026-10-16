import { beforeEach, describe, expect, it, vi } from 'vitest';
import { resolveUserIdByEmail } from './resolveUser';
const { getUsers } = vi.hoisted(() => ({ getUsers: vi.fn() }));
vi.mock('./index', () => ({ getUsers }));
beforeEach(() => vi.clearAllMocks());
describe('exact user email lookup', () => {
  it('skips partial search matches and checks subsequent pages', async () => {
    getUsers.mockResolvedValueOnce({ users: [{id:'wrong',email:'another@example.com'}],totalPages:2 }).mockResolvedValueOnce({users:[{id:'correct',email:'Ada@Example.com'}],totalPages:2});
    await expect(resolveUserIdByEmail('ada@example.com')).resolves.toBe('correct');
    expect(getUsers).toHaveBeenLastCalledWith({currentPage:2,limit:100,search:'ada@example.com'});
  });
  it('rejects unmatched results instead of using an unrelated ID', async () => {
    getUsers.mockResolvedValue({users:[{id:'wrong',email:'another@example.com'}],totalPages:1});
    await expect(resolveUserIdByEmail('ada@example.com')).rejects.toThrow('No user profile');
  });
});
