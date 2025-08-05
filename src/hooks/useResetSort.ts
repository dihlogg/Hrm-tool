import { Dispatch, SetStateAction } from "react";

export function useResetSort(
  setSortBy: Dispatch<SetStateAction<string | undefined>>,
  setSortOrder: Dispatch<SetStateAction<any>>,
  setCurrentPage: Dispatch<SetStateAction<number>>
) {
  return () => {
    setSortBy(undefined);
    setSortOrder(undefined);
    setCurrentPage(1);
  };
}
