import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function LoginButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/login">
        <LogIn />
        Login
      </Link>
    </Button>
  );
}
