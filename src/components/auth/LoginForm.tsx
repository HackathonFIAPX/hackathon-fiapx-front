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
import { Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export function LoginForm() {
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
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    try {
      const response = await defaultAxios.post("/v1/users/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("Login bem-sucedido:", response.data);
      toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para o painel...",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
          title: "Erro ao fazer login",
          description: "Verifique suas credenciais e tente novamente.",
          variant: "destructive",
      });
    }
    
  }

  return (
    <Card className="w-full max-w-md gradient-border rounded-lg">
      <div className="bg-card rounded-md">
        <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold font-headline gradient-text">Bem-vindo de volta!</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
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
                <Button type="submit" className="w-full font-bold text-lg gradient-button">Entrar</Button>
            </form>
            </Form>
            <div className="mt-6 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/signup" className="underline text-primary font-bold hover:text-primary/80">
                Cadastre-se
            </Link>
            </div>
        </CardContent>
      </div>
    </Card>
  );
}
