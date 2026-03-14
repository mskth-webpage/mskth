"use client";

import { Button } from "@/components/ui/button";

interface Subscription {
  id: number;
  username: string;
  email: string;
}

interface SupabaseViewProps {
  subscriptions: Subscription[] | null;
  onAddSubscription: (formData: FormData) => Promise<void>;
  onDeleteSubscription: (id: number) => Promise<void>;
}

export default function SupabaseView({
  subscriptions,
  onAddSubscription,
  onDeleteSubscription,
}: SupabaseViewProps) {
  return (
    <section className="flex flex-row items-center justify-center gap-6">
      <div className="flex flex-col items-start gap-4">
        <h1>Add a subscription to the database:</h1>
        <form action={onAddSubscription}>
          <input
            name="username"
            type="text"
            placeholder="Add a username"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Add an email"
            required
          />
          <Button type="submit">Submit</Button>
        </form>
        <h1>Current subscriptions:</h1>
        <ul>
          {subscriptions?.map((subscription) => (
            <li key={subscription.id}>
              {subscription.username} | {subscription.email}
              <Button
                onClick={() => onDeleteSubscription(subscription.id)}
                type="button"
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
