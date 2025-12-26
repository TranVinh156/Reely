import { useInView } from "react-intersection-observer";

export function useIntersection(options?: Parameters<typeof useInView>[0]) {
  const { ref, inView, entry } = useInView(options ?? { threshold: 0.6 });
  return { ref, inView, entry };
}