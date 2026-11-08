"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "../../lib/utils";
import { Button } from "../../components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/form";
import { Input } from "../../components/input";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type AuthFormValues = z.infer<typeof authSchema>;

export interface AuthFormProps {
  onSubmit?: (values: AuthFormValues) => void | Promise<void>;
  title?: string;
  description?: string;
  submitLabel?: string;
  className?: string;
}

export function AuthForm({
  onSubmit,
  title = "Sign In",
  description = "Enter your email and password to access your account",
  submitLabel,
  className
}: AuthFormProps) {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const [pending, setPending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = async (values: AuthFormValues) => {
    setSubmitError(null);
    setPending(true);

    try {
      await onSubmit?.(values);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className={cn("w-full max-w-md shadow-xs", className)}>
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-subheading font-w590 leading-tight">
          {title}
        </CardTitle>
        <CardDescription className="text-body-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <CardContent className="space-y-4 pt-0">
            {submitError && (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-foreground"
              >
                {submitError}
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-2 border-t border-border/60 pt-4">
            <Button
              type="submit"
              className="w-full"
              loading={pending}
              disabled={pending}
            >
              {submitLabel ?? title}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
