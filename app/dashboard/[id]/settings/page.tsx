import SettingsClient from "./page.client";

export default function SettingsPage({ params }: { params: { id: string } }) {
  return <SettingsClient merchantId={params.id} />;
}
