export const COMPONENT_NAMES = {
  MODAL_AUTH: "ModalAuth",
} as const;

export type ComponentName =
  (typeof COMPONENT_NAMES)[keyof typeof COMPONENT_NAMES];

export enum DirectionType {
  LEFT,
  RIGHT,
}
