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
import { useState } from "react";
import InputMask from 'react-input-mask';
import HelperDialog from "@/components/helper-dialog";

export default function PartnerForm() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof PartnerSchema>>({
        resolver: zodResolver(PartnerSchema),
        defaultValues: {
            nome: "",
            email: "",
            cpf: "",
            tipo: "user",
            senha: "",
        },
    });

    async function onSubmit(values: z.infer<typeof PartnerSchema>) {
        console.log({ values });
        try {
            await createPartner(values);
            setErrorMessage(null); // Limpa o erro caso a criação seja bem-sucedida
        } catch (error: unknown) { // Especificando o tipo 'unknown' para o erro
            console.error("Erro na requisição:", error);

            // Verifica se o erro é uma instância de 'Error' antes de acessar a propriedade 'message'
            if (error instanceof Error) {
                if (error.message === "Usuário com esse CPF já existe.") {
                    setErrorMessage("Este CPF já está em uso. Por favor, insira um CPF diferente.");
                } else if (error.message === "Usuário com esse email já existe.") {
                    setErrorMessage("Este email já está em uso. Por favor, insira um email diferente.");
                } else {
                    setErrorMessage("Erro ao criar usuário. Tente novamente.");
                }
            } else {
                setErrorMessage("Erro desconhecido. Tente novamente.");
            }
        }
    }

    return (
        <main className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-700 font-bold pb-3 text-3xl">Adicionar Sócio</div>

                    <HelperDialog title='Ajuda'>
                        <div>
                            {/* Conteúdo da ajuda aqui */}
                            Insira os dados do sócio para criar um novo registro. Verifique se todos os campos estão corretos antes de enviar.
                        </div>
                    </HelperDialog>
                </div>

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
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-gray-800 mb-2">CPF</FormLabel>
                                    <FormControl>
                                        <InputMask
                                            mask="999.999.999-99"
                                            placeholder="CPF"
                                            className="border-gray-300 bg-gray-100 text-gray-800 w-full p-2 rounded-md"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
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
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                Selecione o tipo do usuário
                                            </option>
                                            <option value="admin">Administrador</option>
                                            <option value="user">Comum</option>
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

                        <FormField
                            control={form.control}
                            name="confirmarSenha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800">Confirmar Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirmar Senha"
                                            className="border-gray-300 bg-gray-100 text-gray-800"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Exibe a mensagem de erro se houver */}
                        {errorMessage && (
                            <div className="text-red-600 text-center mt-4">{errorMessage}</div>
                        )}

                        <div className="flex justify-center">
                            <Button type="submit" variant="outline">
                                Criar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    )
}
