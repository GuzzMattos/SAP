"use client";

import { PartnerSchema } from "@/lib/schemas/partner";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createPartner } from "@/app/_actions/partner"

export default function PartnerForm() {
    const form = useForm<z.infer<typeof PartnerSchema>>({
        resolver: zodResolver(PartnerSchema),
        defaultValues: {
            nome: "",
            email: "",
            cpf: "",
            tipo: "Comum",
            senha: "",
        },
    });

    async function onSubmit(values: z.infer<typeof PartnerSchema>) {
        console.log({ values })
        try {
            await createPartner(values);
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao criar usuário!");
        }
    }

    return (

        <main className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">

            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-2xl">
                <div className="text-gray-700 font-bold pb-3 text-3xl text-center">Adicionar Sócio</div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800">Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nome"
                                            className="border-gray-300 bg-gray-100 text-gray-800"
                                            {...field}
                                        />
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
                                    <FormLabel className="text-gray-800">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            className="border-gray-300 bg-gray-100 text-gray-800"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800">CPF</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="CPF"
                                            className="border-gray-300 bg-gray-100 text-gray-800"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tipo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800">Tipo de Usuário</FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <option value="Administrador">Administrador</option>
                                            <option value="Comum">Comum</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="senha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800">Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Senha"
                                            className="border-gray-300 bg-gray-100 text-gray-800"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-center">
                            <Button type="submit" variant="outline">
                                Criar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}
