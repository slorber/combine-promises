type UnwrapPromise<P extends Promise<unknown>> = P extends PromiseLike<infer V>
  ? V
  : never;

type Input = Record<string | number | symbol, Promise<unknown>>;

type Result<Obj extends Input> = {
  [P in keyof Obj]: UnwrapPromise<Obj[P]>;
};

export default async function combinePromises<Obj extends Input>(
  obj: Obj
): Promise<Result<Obj>> {
  if (obj === null) {
    throw new Error('combinePromises does not handle null argument');
  }
  if (typeof obj !== 'object') {
    throw new Error(
      `combinePromises does not handle argument of type ${typeof obj}`
    );
  }

  const keys = Object.keys(obj);
  const values = await Promise.all(Object.values(obj));

  const result: any = {};
  values.forEach((v, i) => {
    result[keys[i]] = v;
  });
  return result;
}
