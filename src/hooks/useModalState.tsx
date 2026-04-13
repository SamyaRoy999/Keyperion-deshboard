import { useState } from "react";

type BooleanState = Record<string, boolean>;
type BooleanStateUpdater<T extends BooleanState> = <K extends keyof T>(
  key: K,
  value: boolean
) => void;

export function useModalState<T extends BooleanState>(
  initialState: T
): [T, BooleanStateUpdater<T>] {
  const [state, setState] = useState<T>(initialState);

  const updateState: BooleanStateUpdater<T> = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return [state, updateState];
}
