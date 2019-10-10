const editorPaths = {
  list: {
    path: "/list"
  },
  create: {
    path: "/create"
  },
  edit: {
    path: "/edit/:id"
  }
};

const findPath = (
  obj: { [key: string]: { path: string } | string },
  search: { path: string }
): string | undefined => {
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === "string") {
      continue;
    }

    if (obj[key] === search) {
      return value.path;
    } else {
      const deepPath = findPath(value, search);
      if (deepPath) {
        return value.path + deepPath;
      }
    }
  }

  return undefined;
};

/**
 * Recursively search the data structure above and find the object that was passed
 * This allows us to do something like:
 * getPath(paths.dashboard.settings) => '/dashboard/settings'
 * Now the caller doesn't need to know the full structure of the app to form a meaningful path
 */
export const getPath = (
  search: (paths: typeof editorPaths) => { path: string },
  params?: Record<string, string>
) => {
  const searchResult = search(editorPaths);

  let path = findPath(editorPaths, searchResult) as string;
  if (!path) {
    throw new Error("No path found.");
  }

  if (params) {
    Object.keys(params).forEach(key => {
      const value = params[key];
      path = path.replace(`:${key}`, value);
    });
  }

  return path;
};
