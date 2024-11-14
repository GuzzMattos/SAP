"use client"

import { TClientById, updateClientById } from "@/app/_actions/client";
import { UpdateClientSchema } from "@/lib/schemas/client";
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
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TPartner } from "@/app/_actions/partner";
import { Checkbox } from "@/components/ui/checkbox";
import { professions } from "@/lib/profissoes";
import { useRouter } from "next/navigation"; // Importação adicionada
import { TFamiliarById, updateFamiliar } from "@/app/_actions/familiar";
import { UpdateFamiliarSchema } from "@/lib/schemas/familiar";



interface IEditFamiliarForm {
    familiar: TFamiliarById;
}

export const EditFamiliarForm = ({ familiar }: IEditFamiliarForm) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof UpdateFamiliarSchema>>({
        resolver: zodResolver(UpdateFamiliarSchema),
        defaultValues: {
            est_civil: familiar.est_civil as any,
            vivo: familiar.vivo,
            nome_conj: familiar.nome_conj as any,
        },
    })

    async function onSubmit(values: z.infer<typeof UpdateFamiliarSchema>) {
        try {
            await updateFamiliar(familiar.id_familiar, values);
            alert("Familiar atualizado com sucesso!");
            router.push("/admin/clients");

        } catch (error) {
            console.error("Erro ao atualizar o cliente:", error);
            alert("Erro ao atualizar o cliente.");
        }
    }

    const pending = form.formState.isSubmitting;


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full p-4">

                <FormField
                    control={form.control}
                    name="est_civil"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 flex">Estado Civil <div className="text-red-600">*</div></FormLabel>
                            <FormControl>
                                <select
                                    className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <option value="Solteiro">Solteiro</option>
                                    <option value="Casado">Casado</option>
                                    <option value="Divorciado">Divorciado</option>
                                    <option value="Viúvo">Viúvo</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {form.watch("est_civil") === "Casado" && (
                    <FormField
                        control={form.control}
                        name="nome_conj"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-800 flex">Nome do Cônjuge<div className="text-red-600">*</div></FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nome do Cônjuge"
                                        className="border-gray-300 bg-gray-100 text-gray-800"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="vivo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 flex">Está Vivo<div className="text-red-600">*</div></FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        className="border-black"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <span className="text-gray-800">Sim</span>
                                    <Checkbox
                                        className="border-black"
                                        checked={!field.value}
                                        onCheckedChange={() => field.onChange(!field.value)}
                                    />
                                    <span className="text-gray-800">Não</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="outline" className="h-[40px] w-full " >
                    {pending ? <Loader className="animate-spin" /> : 'Salvar Alterações'}
                </Button>
            </form>
        </Form>
    )
}



