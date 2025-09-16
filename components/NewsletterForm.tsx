"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.currentTarget as HTMLFormElement & { email: { value: string } };
      const email = form.email.value.trim();
      if (!email) throw new Error("Please enter an email");
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!gmailRegex.test(email)) {
        throw new Error("Please use a valid @gmail.com address");
      }

      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Subscription failed");
      }
      toast.success("Thanks! You're subscribed.");
      form.reset();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input name="email" placeholder="Enter your email" type="email" required />
      <Button className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
} 