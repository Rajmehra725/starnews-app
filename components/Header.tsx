import React from "react";
import StarHeader, { StarHeaderProps } from "./StarHeader";

export * from "./StarHeader";

export interface HeaderProps extends StarHeaderProps {
  onSearchPress: () => void;
  onNotificationsPress: () => void;
  onMenuPress?: () => void;
  onDistrictPress?: () => void;
  currentDistrict?: string;
  unreadNotifications?: boolean;
}

export default function Header(props: HeaderProps) {
  return <StarHeader variant="home" {...props} />;
}
