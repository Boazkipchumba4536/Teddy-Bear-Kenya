import Link from "next/link";

interface LegalCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  id?: string;
}

export default function LegalCheckbox({
  checked,
  onChange,
  error,
  id = "accept-legal",
}: LegalCheckboxProps) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer text-sm text-ink-muted">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 accent-caramel shrink-0"
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" target="_blank" className="text-caramel hover:underline">
            Terms of Service
          </Link>
          ,{" "}
          <Link href="/privacy" target="_blank" className="text-caramel hover:underline">
            Privacy Policy
          </Link>
          , and{" "}
          <Link href="/cookies" target="_blank" className="text-caramel hover:underline">
            Cookie Policy
          </Link>
          .
        </span>
      </label>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
