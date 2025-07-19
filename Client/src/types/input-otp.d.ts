declare module "input-otp" {
  import * as React from "react";

  export interface OTPSlot {
    char: string;
    hasFakeCaret: boolean;
    isActive: boolean;
  }

  export interface OTPInputContextType {
    slots: OTPSlot[];
  }

  export const OTPInputContext: React.Context<OTPInputContextType>;

  export interface OTPInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    maxLength?: number;
    value?: string;
    onChange?: (value: string) => void;
    containerClassName?: string;
    className?: string;
  }

  export const OTPInput: React.ForwardRefExoticComponent<
    OTPInputProps & React.RefAttributes<HTMLInputElement>
  >;
}
