"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../components/form";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/card";

export const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  organization: z.string().min(1, "Organization is required."),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface FormWithValidationProps {
  defaultValues?: Partial<ProfileFormValues>;
  onSubmit?: (values: ProfileFormValues) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
}

export function FormWithValidation({
  defaultValues = { fullName: "", email: "", organization: "" },
  onSubmit,
  submitLabel = "Save Profile",
  className,
}: FormWithValidationProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });
  const [pending, setPending] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = async (values: ProfileFormValues) => {
    setSubmitError(null);
    setPending(true);

    try {
      await onSubmit?.(values);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to save the profile. Please try again."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-base font-semibold">
          User Profile Settings
        </CardTitle>
        <CardDescription>
          Update your profile details for heuristic evaluation reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitError && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-foreground"
          >
            {submitError}
          </div>
        )}
        <Form {...form}>
          <form
            id="profile-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Jacob Nielsen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Email</FormLabel>
                  <FormControl>
                    <Input placeholder="nielsen@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Reports will be dispatched to this email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization / University</FormLabel>
                  <FormControl>
                    <Input placeholder="NN/g Institute" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-border/60 pt-4">
        <Button type="submit" form="profile-form" loading={pending} disabled={pending}>
          {submitLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
