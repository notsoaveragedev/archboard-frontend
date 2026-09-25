import { Progress } from "antd";
import { LuCheck, LuCircle } from "react-icons/lu";
import { getPasswordStrength, type PasswordRule } from "../../lib/validation";
import { palette } from "../../theme/palette";

const SCORE_COLORS = [palette.danger, palette.danger, palette.warning, palette.warning, palette.success];

export function PasswordStrength({ password }: { password: string }) {
  const { score, label } = getPasswordStrength(password);

  return (
    <div className="flex items-center gap-2.5">
      <Progress
        steps={4}
        percent={score * 25}
        showInfo={false}
        strokeColor={SCORE_COLORS[score]}
        railColor={palette.line}
        size={[64, 4]}
        className="flex-1"
      />
      <span className="min-w-20 text-right text-xs text-muted" aria-live="polite">
        {password ? label : "Strength"}
      </span>
    </div>
  );
}

export function PasswordChecklist({ rules }: { rules: PasswordRule[] }) {
  return (
    <ul className="mt-2.5 flex flex-col gap-1.5 text-[13px]">
      {rules.map((rule) => (
        <li key={rule.label} className={`flex items-center gap-2 ${rule.passed ? "text-ink" : "text-muted"}`}>
          {rule.passed ? (
            <LuCheck className="size-3.5 text-success" aria-label="Done" />
          ) : (
            <LuCircle className="size-3.5 text-subtle" aria-label="Not yet" />
          )}
          {rule.label}
        </li>
      ))}
    </ul>
  );
}
