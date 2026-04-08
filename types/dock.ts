import type { ReactElement } from "react";

export type DockAppItem = {
  id: string;
  name: string;
  icon: ReactElement;
  isDivider?: boolean;
};
