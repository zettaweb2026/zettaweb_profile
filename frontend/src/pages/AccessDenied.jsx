import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const AccessDenied = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-20 text-foreground">
      <Card className="glass-card w-full max-w-md rounded-2xl border-destructive/20">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldX className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold">Access Denied</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Your account does not have permission to access the admin dashboard.
          </p>
          <Button asChild className="mt-6 w-full rounded-xl">
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default AccessDenied;
