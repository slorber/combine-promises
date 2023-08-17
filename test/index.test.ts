import combinePromises from '../src';

type User = { id: number; firstName: string };
type Company = { id: number; companyName: string };

function createUser(id: number): User {
  return { id, firstName: `user firstName ${id}` };
}

function createCompany(id: number): Company {
  return { id, companyName: `company name ${id}` };
}

async function fetchUser(id: number): Promise<User> {
  return createUser(id);
}
async function fetchCompany(id: number): Promise<Company> {
  return createCompany(id);
}

describe('combinePromises', () => {
  it('can handle empty object', async () => {
    const result = await combinePromises({});
    expect(result).toEqual({});
  });

  it('can handle 1 async value', async () => {
    const result: { user: User } = await combinePromises({
      user: fetchUser(1),
    });
    expect(result).toEqual({ user: createUser(1) });
  });

  it('can handle 2 async values of same type', async () => {
    const result: { user: User; user2: User } = await combinePromises({
      user: fetchUser(1),
      user2: fetchUser(2),
    });
    expect(result).toEqual({ user: createUser(1), user2: createUser(2) });
  });

  it('can handle 2 async values of different types', async () => {
    const result: { user: User; company: Company } = await combinePromises({
      user: fetchUser(1),
      company: fetchCompany(2),
    });
    expect(result).toEqual({ user: createUser(1), company: createCompany(2) });
  });

  it('can handle sync values', async () => {
    const result: { user: User; company: Company } = await combinePromises({
      user: fetchUser(1),
      company: createCompany(2),
    });
    expect(result).toEqual({ user: createUser(1), company: createCompany(2) });
  });

  it('can handle arrays, but TS errors', async () => {
    // @ts-expect-error: arrays is invalid type
    const result: { user: User; company: Company } = await combinePromises([
      fetchUser(1),
      fetchCompany(2),
    ]);
    expect(result).toEqual({ 0: createUser(1), 1: createCompany(2) });
  });

  it('throws when illegal arg', async () => {
    await expect(
      // @ts-expect-error: illegal typing
      combinePromises(undefined)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"combinePromises does not handle argument of type undefined"`
    );

    await expect(
      // @ts-expect-error: illegal typing
      combinePromises(null)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"combinePromises does not handle null argument"`
    );

    await expect(
      // @ts-expect-error: illegal typing
      combinePromises(1)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"combinePromises does not handle argument of type number"`
    );

    await expect(
      // @ts-expect-error: illegal typing
      combinePromises('hello')
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"combinePromises does not handle argument of type string"`
    );

    await expect(
      // @ts-expect-error: illegal typing
      combinePromises(Symbol('hello'))
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"combinePromises does not handle argument of type symbol"`
    );
  });
});
