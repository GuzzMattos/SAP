"use client";

import { PartnerSchema } from "@/lib/schemas/partner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { getPartnerById, updatePartner } from "@/app/_actions/partner";
import InputMask from "react-input-mask";

export default function EditPartnerForm() {
    const router = useRouter();
    const { id } = useParams();
    const partnerId = Array.isArray(id) ? id[0] : id; // Confirma que `id` é uma string

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        if (!partnerId) {
            setError("ID do sócio não encontrado.");
            setLoading(false);
            return;
        }

        const fetchPartnerData = async () => {
            try {
                const data = await getPartnerById(partnerId);
                if (data) {
                    form.reset({
                        ...data,
                        tipo: data.tipo === "admin" ? "admin" : "user",
                    });
                } else {
                    throw new Error("Dados do sócio não encontrados.");
                }
            } catch (error) {
                console.error("Erro ao carregar dados do sócio:", error);
                setError("Erro ao carregar dados do sócio.");
            } finally {
                setLoading(false);
            }
        };

        fetchPartnerData();
    }, [partnerId, form]);

    async function onSubmit(values: z.infer<typeof PartnerSchema>) {
        try {
            await updatePartner(partnerId, values);
            alert("Dados atualizados com sucesso!");
            router.push("/admin/partners");
        } catch (error) {
            console.error("Erro ao atualizar sócio:", error);
            alert("Erro ao atualizar sócio!");
        }
    }

    if (loading) return <p>Carregando dados do sócio...</p>;

    if (error) return <p>{error}</p>;

    return (
        <main className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-2xl">
                <div className="text-gray-700 font-bold pb-3 text-3xl text-center">Editar Sócio</div>

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
                                        >
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

                        <div className="flex justify-center">
                            <Button type="submit" variant="outline">
                                Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}
