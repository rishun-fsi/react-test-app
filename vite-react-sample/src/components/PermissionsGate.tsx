import { PERMISSIONS } from "./permission-maps";
import { useGetRole } from "./useGetRole";
import { ReactNode, ReactElement, cloneElement } from "react";


type ErrorProps = {
    // errorProps プロップが持つべきプロパティをここに指定する
    // 例: message: string;
    // また、具体的なプロパティに応じて型を調整する
    message?: string;
    disabled: boolean;
  }

interface PermissionsGateProps {
  children: ReactNode;
  RenderError?: () => ReactElement;
  errorProps?: ErrorProps | null;
  scopes?: string[];
}

const hasPermission = ({ permissions, scopes }: { permissions: string[], scopes: string[] }) => {
  const scopesMap: Record<string, boolean> = {};
  scopes.forEach((scope) => {
    scopesMap[scope] = true;
  });

  return permissions.some((permission) => scopesMap[permission]);
};

export default function PermissionsGate({
  children,
  RenderError = () => <></>,
  errorProps = null,
  scopes = []
}: PermissionsGateProps) {
  const { role } = useGetRole();
  const permissions = PERMISSIONS[role];

  const permissionGranted = hasPermission({ permissions, scopes });

  if (!permissionGranted && !errorProps) return <RenderError />;

  if (!permissionGranted && errorProps)
    return cloneElement(children as ReactElement, { ...errorProps });

  return <>{children}</>;
}
