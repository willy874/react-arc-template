export const arrafi = <T>(arr: T | T[]) => (Array.isArray(arr) ? arr : [arr]);

export function findNode<Child extends string = 'children', Node extends { [K in Child]?: Node[] } = object>(
  list: Node[],
  target: Node,
  options?: {
    findKey?: Child;
    paths?: (Child | string | number)[];
    is?: (node: Node) => boolean;
  },
): [Node[], number] | null {
  const { findKey = 'children', is = (n: Node) => n === target, paths = [] } = options || {};
  let nextPaths = paths.slice();
  let nextList: Node[] | null = null;
  for (let index = 0; index < list.length; index++) {
    const node = list[index];
    if (node) {
      nextPaths = nextPaths.concat(index);
    }
    if (is(node)) {
      return [list, index] as const;
    }
    nextList = node[findKey] || null;
    if (nextList) {
      nextPaths = nextPaths.concat(findKey);
      const pathList = findNode(nextList, target, {
        ...options,
        paths: nextPaths.slice(),
      });
      if (pathList) {
        return pathList;
      }
    }
  }
  return null;
}
