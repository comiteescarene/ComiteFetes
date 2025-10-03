export default function Footer() {
  return (
    <footer className="border-t bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
        <div className="flex flex-wrap items-center gap-4">
          <span>© {new Date().getFullYear()} Comité des Fêtes de L’Escarène</span>
          <a className="underline" href="/legal/mentions-legales">Mentions légales</a>
          <a className="underline" href="/legal/confidentialite">Confidentialité</a>
          <a className="underline" href="/legal/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
