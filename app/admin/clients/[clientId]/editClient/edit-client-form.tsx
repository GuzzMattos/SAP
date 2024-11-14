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



interface IEditClientForm {
    client: TClientById;
    partners: TPartner;
}

export const EditClientForm = ({ client, partners }: IEditClientForm) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof UpdateClientSchema>>({
        resolver: zodResolver(UpdateClientSchema),
        defaultValues: {
            dualNationality: client.dupla_nacio,
            email: client.email,
            maritalStatus: client.est_civil as any,
            partnerId: client.id_user,
            profession: client.profissao,
            propertyRegime: client.reg_bens,
            taxResidenceInBrazil: client.res_fiscal_brasil
        },
    })

    async function onSubmit(values: z.infer<typeof UpdateClientSchema>) {
        try {
            await updateClientById(client.id_cliente, values);
            alert("Cliente atualizado com sucesso!");
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" type="email" {...field} className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="partnerId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 flex">Sócio<div className="text-red-600">*</div></FormLabel>
                            <FormControl>
                                <select
                                    className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                >
                                    <option value="" disabled>
                                        Selecione um sócio
                                    </option>
                                    {partners.map((p) => (
                                        <option key={p.id_user} value={p.id_user}>
                                            {p.nome}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="maritalStatus"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-800 flex">Estado Civil<div className="text-red-600">*</div></FormLabel>
                                <FormControl>
                                    <select
                                        className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        <option value="Casado">Casado</option>
                                        <option value="Solteiro">Solteiro</option>
                                        <option value="Divorciado">Divorciado</option>
                                        <option value="Viúvo">Viúvo</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.watch("maritalStatus") === "Casado" && (
                        <FormField
                            control={form.control}
                            name="propertyRegime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Regime de Bens<div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <option value="" disabled>Selecione um regime de bens</option>
                                            <option value="Separação total de bens">Separação total de bens</option>
                                            <option value="Comunhão parcial de bens">Comunhão parcial de bens</option>
                                            <option value="Comunhão universal de bens">Comunhão universal de bens</option>
                                            <option value="Participação final nos aquestos">Participação final nos aquestos</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <FormField
                    control={form.control}
                    name="dualNationality"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 flex">Dupla Nacionalidade<div className="text-red-600">*</div></FormLabel>
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

                <FormField
                    control={form.control}
                    name="taxResidenceInBrazil"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 flex">Residência Fiscal no Brasil<div className="text-red-600">*</div></FormLabel>
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

                <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 flex">Profissão<div className="text-red-600">*</div></FormLabel>
                            <FormControl>
                                <select
                                    className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <option value="" disabled>
                                        Selecione uma profissão
                                    </option>
                                    {professions.map((profession) => (
                                        <option key={profession} value={profession}>
                                            {profession}
                                        </option>
                                    ))}
                                </select>
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
