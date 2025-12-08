// components/StartBlindTestButton.tsx

type Props = {
  onClick?: () => void;
};

export function StartBlindTestButton({ onClick }: Props) {
  return (
    <button className="start-blind-test" onClick={onClick}>
      ▶ Commencer le Blind Test
    </button>
  );
}
