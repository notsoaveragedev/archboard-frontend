import { Select, type SelectProps } from "antd";
import { useId, type ReactNode } from "react";
import { FieldShell } from "./FieldShell";

type CustomSelectProps<Value> = Omit<SelectProps<Value>, "status"> & {
  label?: string;
  error?: string | null;
  hint?: ReactNode;
  labelAction?: ReactNode;
  labelClassName?: string;
};

// Defaults to size="large" so it matches CustomInput's height in forms.
export function CustomSelect<Value = string>({
  label,
  error,
  hint,
  labelAction,
  labelClassName,
  id,
  size = "large",
  ...props
}: CustomSelectProps<Value>) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  return (
    <FieldShell
      label={label}
      htmlFor={selectId}
      labelAction={labelAction}
      labelClassName={labelClassName}
      error={error}
      hint={hint}
      messageId={messageId}
    >
      <Select<Value>
        {...props}
        id={selectId}
        size={size}
        status={error ? "error" : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? messageId : undefined}
      />
    </FieldShell>
  );
}
