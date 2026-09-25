import type { ThemeConfig } from "antd";
import { palette } from "./palette";

// A faint 2px halo keeps focus visible without the heavy default glow.
const focusRing = "0 0 0 2px rgba(45, 91, 255, 0.08)";
const errorFocusRing = "0 0 0 2px rgba(229, 72, 77, 0.08)";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: palette.brand,
    colorInfo: palette.brand,
    colorLink: palette.brand,
    colorLinkHover: palette.brandHover,
    colorSuccess: palette.success,
    colorWarning: palette.warning,
    colorError: palette.danger,

    colorTextBase: palette.ink,
    colorText: palette.ink,
    colorTextSecondary: palette.muted,
    colorTextTertiary: palette.muted,
    colorTextPlaceholder: palette.subtle,

    colorBorder: palette.lineStrong,
    colorBorderSecondary: palette.line,
    colorSplit: palette.line,
    colorBgLayout: palette.app,
    colorBgContainer: palette.surface,
    colorFillTertiary: palette.hover,

    fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif",
    fontFamilyCode: "'Geist Mono', ui-monospace, monospace",
    fontSize: 14,
    fontSizeLG: 14,

    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    controlHeight: 36,
    controlHeightLG: 38,
    controlOutline: "rgba(45, 91, 255, 0.08)",
    controlOutlineWidth: 2,

    boxShadow: "0 8px 24px rgba(11, 18, 32, 0.10)",
    boxShadowSecondary: "0 8px 24px rgba(11, 18, 32, 0.10)",
  },
  components: {
    Button: {
      fontWeight: 500,
      primaryShadow: "none",
      defaultShadow: "none",
      dangerShadow: "none",
    },
    Input: {
      activeShadow: focusRing,
      errorActiveShadow: errorFocusRing,
      hoverBorderColor: palette.subtle,
    },
    Form: {
      labelFontSize: 13,
      labelHeight: "auto",
      verticalLabelPadding: "0 0 4px",
      itemMarginBottom: 16,
    },
    Alert: {
      withDescriptionPadding: "10px 12px",
    },
  },
};
