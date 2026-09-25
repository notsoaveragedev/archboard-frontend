import { Avatar, Tooltip } from "antd";
import type { Member } from "../../types/workspace";

type AvatarSize = "xs" | "sm";

const SIZES: Record<AvatarSize, { size: string; fontSize: string; border: string }> = {
  xs: { size: "1.25rem", fontSize: "0.5625rem", border: "none" },
  sm: { size: "1.75rem", fontSize: "0.625rem", border: "0.125rem solid #FFFFFF" },
};

type MemberAvatarProps = {
  member: Member;
  size?: AvatarSize;
  showRing?: boolean;
  showTooltip?: boolean;
};

export function MemberAvatar({ member, size = "sm", showRing = false, showTooltip = true }: MemberAvatarProps) {
  const dimensions = SIZES[size];

  const avatar = (
    <Avatar
      style={{
        width: dimensions.size,
        height: dimensions.size,
        lineHeight: dimensions.size,
        backgroundColor: member.color.bg,
        color: member.color.fg,
        fontSize: dimensions.fontSize,
        fontWeight: 600,
        border: showRing ? `0.125rem solid ${member.color.ring}` : dimensions.border,
      }}
      className="shrink-0"
    >
      {member.initials}
    </Avatar>
  );

  return showTooltip ? <Tooltip title={member.name}>{avatar}</Tooltip> : avatar;
}
