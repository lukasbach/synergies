import { useEffect } from "react";

export const useHideBars = () => {
  useEffect(() => {
    const elements: HTMLDivElement[] = document.getElementsByClassName(
      "navbar"
    ) as unknown as HTMLDivElement[];
    const originalDisplay = [];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element && element.style) {
        originalDisplay[i] = element.style?.display;
        element.style.display = "none";
      }
    }
    return () => {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element && element.style) {
          element.style.display = originalDisplay[i];
        }
      }
    };
  }, []);
};
