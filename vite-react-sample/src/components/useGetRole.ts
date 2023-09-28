// useGetRole.ts

import { ROLES } from "./permission-maps"; // このインポートは必要に応じて調整する必要があります

export function useGetRole(): { role: string } {
  // 実際のロールを取得するロジックをここに追加する
  // この例ではダミーのロール "viewer" を返すものとしていますが、実際のロジックに合わせて変更してください。
  const role = ROLES.viewer; // 仮の値

  return { role };
}
