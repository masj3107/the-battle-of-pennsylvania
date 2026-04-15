const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(src: string) {
  if (!src) {
    return src;
  }

  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) {
    return src;
  }

  if (!src.startsWith("/")) {
    return src;
  }

  return `${basePath}${src}`;
}
