export const get = async <T>(uri: string): Promise<T | null> => {
  const result = await fetch(uri, {
    method: "GET",
  });

  return result.json();
};

export const post = async <T, R>(uri: string, data: T): Promise<R | null> => {
  const result = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return result.json();
};
