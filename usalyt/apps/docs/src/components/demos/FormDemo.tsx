import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Button } from "@usalyt/ui";

export function FormDemo() {
  const methods = useForm({
    defaultValues: {
      username: "",
    },
  });

  return (
    <div className="w-full max-w-xs">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data) => alert(JSON.stringify(data)))} className="space-y-4">
          <FormField
            control={methods.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
}
