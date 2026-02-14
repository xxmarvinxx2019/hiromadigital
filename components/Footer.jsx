export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--hiroma-border)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <h4 className="mb-2">HIROMA</h4>
          <p className="text-[var(--hiroma-muted)]">
            A structured platform for building a perfume distribution business
            through transparency and controlled growth.
          </p>
        </div>

        <div>
          <h4 className="mb-2">Platform</h4>
          <ul className="space-y-2 text-[var(--hiroma-muted)]">
            <li>Packages</li>
            <li>How It Works</li>
            <li>Distributor Access</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2">Legal</h4>
          <ul className="space-y-2 text-[var(--hiroma-muted)]">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-[var(--hiroma-muted)] py-4 border-t">
        © {new Date().getFullYear()} HIROMA. All rights reserved.
      </div>
    </footer>
  );
}
