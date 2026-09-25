import { SiPlaycanvas } from "react-icons/si";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-lg bg-brand">
        <SiPlaycanvas className="size-4 rotate-90 text-white" />
      </div>
      <span className="text-[15px] font-semibold tracking-tight text-ink">archboard</span>
    </div>
  );
}
