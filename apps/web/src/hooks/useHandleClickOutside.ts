import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

export const useHandleClickOutside = (
  refs: RefObject<HTMLElement | null>[],
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;

      const isClickInside = refs.some(
        (ref) => ref.current && ref.current.contains(target)
      );
      const selectDropdowns = document.querySelectorAll(
        '[data-slot="select-content"][data-state="open"]'
      );
      const isClickInsideSelect = Array.from(selectDropdowns).some((el) =>
        el.contains(target)
      );

      if (!isClickInside && !isClickInsideSelect) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, setOpen]);
};
