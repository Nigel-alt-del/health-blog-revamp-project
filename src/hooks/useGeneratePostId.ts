
export const useGeneratePostId = () => {
  return (title: string) => {
    const baseId = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);
    const timestamp = Date.now();
    return `${baseId}-${timestamp}`;
  };
};
