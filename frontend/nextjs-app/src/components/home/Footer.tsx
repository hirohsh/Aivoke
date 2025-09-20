export default function Footer() {
  return (
    <footer className="mt-16 flex flex-col items-center justify-center gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
      <p className="text-center">© {new Date().getFullYear()} Aivoke. All rights reserved.</p>
    </footer>
  );
}
