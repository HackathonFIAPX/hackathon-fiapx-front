"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();

  const baseURL = "https://uaxin4s2g9.execute-api.us-west-2.amazonaws.com/admin-api"
  const defaultAxios = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { email, password } = values;
    try {
      await defaultAxios.post("/v1/users/signup", { email, password });
      toast({
          title: "Cadastro realizado com sucesso!",
          description: "Você será redirecionado para fazer o login.",
      });
      router.push("/");
    } catch {
      toast({
          title: "Erro ao cadastrar",
          description: "Ocorreu um erro ao tentar criar sua conta. Por favor, tente novamente.",
          variant: "destructive",
      });
    }
    
  }

  return (
    <Card className="w-full max-w-md gradient-border rounded-lg">
        <div className="bg-card rounded-md">
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold font-headline gradient-text">Crie sua conta</CardTitle>
                <CardDescription>É rápido e fácil. Vamos começar!</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                            <Input placeholder="seu@email.com" {...field} className="pl-10" />
                            </FormControl>
                        </div>
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
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                            <Input type="password" placeholder="********" {...field} className="pl-10" />
                            </FormControl>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                            <Input type="password" placeholder="********" {...field} className="pl-10" />
                            </FormControl>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full font-bold text-lg gradient-button">
                        <UserPlus className="mr-2 h-5 w-5"/>
                        Cadastrar
                    </Button>
                </form>
                </Form>
                <div className="mt-6 text-center text-sm">
                Já tem uma conta?{" "}
                <Link href="/" className="underline text-accent font-bold hover:text-accent/80">
                    Faça login
                </Link>
                </div>
            </CardContent>
        </div>
    </Card>
  );
}
