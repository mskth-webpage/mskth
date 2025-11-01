'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardHeader, CardContent } from '@/src/components/ui/card';

export default function HomePageView() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-80 shadow-md">
        <CardHeader>
          <h2 className="text-xl font-bold">shadcn/ui is working 🎉</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            You can now use all shadcn components inside your Next app.
          </p>
          <Button>Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </CardContent>
      </Card>
    </main>
  );
}
