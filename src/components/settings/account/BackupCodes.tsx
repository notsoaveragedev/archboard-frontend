import { Alert, Button } from "antd";
import { useState } from "react";
import { LuCheck, LuCopy, LuDownload } from "react-icons/lu";
import { useToast } from "../../../hooks/useToast";
import { backupCodes } from "../../../mocks/accountSettings";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  function copy() {
    void navigator.clipboard?.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  }

  return (
    <Button size="small" icon={isCopied ? <LuCheck /> : <LuCopy />} onClick={copy} aria-live="polite">
      {isCopied ? "Copied" : label}
    </Button>
  );
}

export function BackupCodesPanel() {
  const toast = useToast();

  return (
    <div className="flex flex-col gap-3">
      <Alert
        type="info"
        showIcon
        title="Save these codes somewhere safe. Each works once, and you won't see them again."
      />
      <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 rounded-lg border border-line bg-hover-subtle p-4 font-mono text-ui tracking-wider tabular-nums">
        {backupCodes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <div className="flex gap-2">
        <CopyButton text={backupCodes.join("\n")} />
        <Button
          size="small"
          icon={<LuDownload />}
          onClick={() => toast.success("Backup codes downloaded", "Saved as archboard-backup-codes.txt.")}
        >
          Download .txt
        </Button>
      </div>
    </div>
  );
}
