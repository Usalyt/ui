import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "tu-ui";

export function InputOtpDemo() {
  const [value, setValue] = React.useState("");

  return (
    <div className="flex flex-col items-center gap-3">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <p className="text-xs text-muted-foreground">
        {value.length === 0
          ? "Demo input — no code is sent."
          : `Filled ${value.length} of 6 digits.`}
      </p>
    </div>
  );
}
