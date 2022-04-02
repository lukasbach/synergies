import { useEffect } from "react";

export const useHideBars = () => {
  useEffect(() => {
    const elements: HTMLDivElement[] = [
      ...(document.getElementsByClassName(
        "navbar"
      ) as unknown as HTMLDivElement[]),
      ...(document.getElementsByClassName(
        "footer"
      ) as unknown as HTMLDivElement[]),
    ];
    const originalDisplay = [];
    elements.forEach((element, i) => {
      originalDisplay[i] = element.style.display;
      element.style.display = "none";
    });
    return () =>
      elements.forEach(
        (element, i) => (element.style.display = originalDisplay[i])
      );
  }, []);
};
