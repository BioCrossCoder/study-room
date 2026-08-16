import { WindowMessageType } from "./enums";

export type WindowMessageData = {
  [WindowMessageType.ContentResize]: {
    height: number;
    width: number;
  };
};

export type WindowMessage<T extends WindowMessageType> = {
  type: T;
  data: WindowMessageData[T];
};
