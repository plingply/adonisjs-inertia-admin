export function handleTree(data: any[], idKey: string, parentIdKey: string, childrenKey: string) {
  const config = {
    id: idKey || 'id',
    parentId: parentIdKey || 'parentId',
    childrenList: childrenKey || 'children',
  }

  const childrenListMap = {} as any
  const nodeIds = {} as any
  const tree: any[] = []

  for (const d of data) {
    const parentId = d[config.parentId]
    if (!childrenListMap[parentId]) {
      childrenListMap[parentId] = []
    }
    nodeIds[d[config.id]] = d
    childrenListMap[parentId].push(d)
  }

  for (const d of data) {
    const parentId = d[config.parentId]
    if (!nodeIds[parentId]) {
      tree.push(d)
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t)
  }

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]]
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c)
      }
    }
  }
  return tree
}
