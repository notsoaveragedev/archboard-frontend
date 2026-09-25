import { Radio, Switch } from "antd";
import { useState, type CSSProperties } from "react";
import { SettingRow, SettingsCard, SettingsSection } from "../../components/settings/SettingsBlocks";
import { SettingsPage } from "../../components/settings/SettingsPage";
import { CustomSelect } from "../../components/ui/CustomSelect";

type Background = "dots" | "lines" | "plain";

const GRID_SIZES = [8, 16, 24, 32].map((size) => ({ value: size, label: `${size} px` }));

const dotColor = "rgb(11 18 32 / 0.22)";
const BACKGROUNDS: { value: Background; label: string; style: CSSProperties }[] = [
  {
    value: "dots",
    label: "Dots",
    style: { backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`, backgroundSize: "0.625rem 0.625rem" },
  },
  {
    value: "lines",
    label: "Lines",
    style: {
      backgroundImage: `linear-gradient(to right, rgb(11 18 32 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(11 18 32 / 0.08) 1px, transparent 1px)`,
      backgroundSize: "0.75rem 0.75rem",
    },
  },
  { value: "plain", label: "Plain", style: {} },
];

export function PreferencesPage() {
  const [background, setBackground] = useState<Background>("dots");
  const [isSnapOn, setIsSnapOn] = useState(true);
  const [gridSize, setGridSize] = useState(16);

  return (
    <SettingsPage title="Preferences" description="Defaults for new boards you create.">
      <SettingsSection title="Canvas defaults" description="Applied to new boards you create.">
        <SettingsCard>
          <SettingRow label="Background" description="The pattern behind your shapes.">
            <Radio.Group value={background} onChange={(event) => setBackground(event.target.value)} className="flex gap-3">
              {BACKGROUNDS.map((option) => (
                <BackgroundTile key={option.value} {...option} isSelected={background === option.value} />
              ))}
            </Radio.Group>
          </SettingRow>
          <SettingRow label="Snap to grid" description="Shapes line up with the grid as you move them.">
            <Switch checked={isSnapOn} onChange={setIsSnapOn} />
          </SettingRow>
          <SettingRow label="Grid size" description="Spacing between grid points.">
            <CustomSelect<number>
              aria-label="Grid size"
              size="middle"
              value={gridSize}
              onChange={setGridSize}
              options={GRID_SIZES}
              className="w-56"
            />
          </SettingRow>
        </SettingsCard>
      </SettingsSection>

    </SettingsPage>
  );
}

type BackgroundTileProps = {
  value: Background;
  label: string;
  style: CSSProperties;
  isSelected: boolean;
};

function BackgroundTile({ value, label, style, isSelected }: BackgroundTileProps) {
  return (
    <Radio
      value={value}
      className="m-0 flex-col items-center after:hidden [&_.ant-radio]:sr-only [&>span:last-child]:p-0 has-[:focus-visible]:[&_.tile]:outline-2 has-[:focus-visible]:[&_.tile]:outline-offset-2 has-[:focus-visible]:[&_.tile]:outline-brand"
    >
      <span
        className={`tile block h-16 w-24 rounded-lg border ${isSelected ? "border-ink bg-selected" : "border-line bg-surface hover:border-line-strong"}`}
        style={style}
      />
      <span className={`mt-1.5 block text-center text-2xs ${isSelected ? "font-medium text-ink" : "text-muted"}`}>
        {label}
      </span>
    </Radio>
  );
}
