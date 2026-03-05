import { useAppStore } from '@/useAppStore';

export default function SessionGate({ children }) {
  const sessionReady = useAppStore((s) => s.sessionReady);

  if (!sessionReady) {
    return <div>로딩 중</div>;
  }

  return children;
}
