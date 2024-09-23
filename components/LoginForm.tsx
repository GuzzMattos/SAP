"use client";

import { LoginSchema } from "@/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { LoginAction } from "@/app/_actions/user";
import { useToast } from "./ui/use-toast";
import Image from "next/image";

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    try {
      const result = await LoginAction(values);

      if (result?.error) {
        toast({
          title: 'Erro',
          description: result.error,
          variant: "destructive"
        });

        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Login efetuado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'An unexpected error occurred. Please try again.',
        variant: "destructive"
      });
    }
  }

  const [inputType, setInputType] = useState<boolean>(true);

  const pending = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <div className="flex flex-col items-center gap-y-8 w-[90%] lg:w-[25%] xl:w-[20%]">

        <Image src={'/assets/logo.png'} alt="logo CDI" width={600} height={300} />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
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
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative flex w-full items-center">
                    <Input
                      type={inputType ? 'password' : 'text'}
                      placeholder="Senha"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => setInputType((prev) => !prev)}
                      className="absolute right-0"
                    >
                      {inputType ? <Eye size={18} /> : <EyeOff size={18} />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="h-[40px] w-full">
            {pending ? <Loader className="animate-spin" /> : 'Login'}
          </Button>
        </form>
      </div>
    </Form>
  )
}