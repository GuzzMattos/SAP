"use client";

import { ClientSchema } from "@/lib/schemas/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import { ChangeEvent, useEffect, useState } from "react";
import { professions } from "@/lib/profissoes";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/app/_actions/client";
import { parse, isValid, format } from "date-fns";
import { TPartner } from "@/app/_actions/partner";

interface IClientForm {
    partners: TPartner;
}

export default function AddClientForm({ partners }: IClientForm) {
    const form = useForm<z.infer<typeof ClientSchema>>({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            name: "",
            cpf: "",
            birthDate: new Date(),
            dualNationality: false,
            maritalStatus: "Solteiro",
            propertyRegime: "",
            taxResidenceInBrazil: false,
            email: "",
            profession: "",
            partnerId: uuidv4(),
        },
    });

    // Utilizando o useWatch para observar o valor de "maritalStatus"
    const maritalStatus = useWatch({
        control: form.control,
        name: "maritalStatus",
    });



    async function onSubmit(values: z.infer<typeof ClientSchema>) {

        try {
            await createClient(values);
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao criar usuário!");
        }
    }

    return (
        <main className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-2xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="birthDate"
                                    render={({ field }) => {
                                        const [displayValue, setDisplayValue] = useState<string>(() =>
                                            field.value ? format(field.value, "dd/MM/yyyy") : ""
                                        );

                                        useEffect(() => {
                                            // Atualiza o estado displayValue quando field.value muda
                                            setDisplayValue(field.value ? format(field.value, "dd/MM/yyyy") : "");
                                        }, [field.value]);

                                        return (
                                            <FormItem>
                                                <FormLabel className="text-gray-800">Data de Nascimento</FormLabel>
                                                <FormControl>
                                                    <InputMask
                                                        mask="99/99/9999"
                                                        value={displayValue}
                                                        onChange={(e) => {
                                                            const dateValue = e.target.value;
                                                            // Converte a string da data para uma instância de Date
                                                            const parsedDate = parse(dateValue, "dd/MM/yyyy", new Date());
                                                            if (isValid(parsedDate)) {
                                                                field.onChange(parsedDate); // Atualiza o valor do campo com a data válida
                                                            } else {
                                                                console.error("Data inválida");
                                                            }
                                                        }}
                                                        className="bg-gray-100 text-gray-800 border border-gray-300 rounded-md p-2 w-full mt-1"
                                                        placeholder="dd/mm/aaaa"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />

                            </div>


                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="maritalStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-800">Estado Civil</FormLabel>
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

                            {maritalStatus === "Casado" && (
                                <FormField
                                    control={form.control}
                                    name="propertyRegime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">Regime de Bens</FormLabel>
                                            <FormControl>
                                                <select
                                                    className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    <option value="">Selecione um regime de bens</option>
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
                                    <FormLabel className="text-gray-800">Dupla Nacionalidade</FormLabel>
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
                                    <FormLabel className="text-gray-800">Residência Fiscal no Brasil</FormLabel>
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
                                    <FormLabel className="text-gray-800">Profissão</FormLabel>
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
                        <FormField
                            control={form.control}
                            name="partnerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800">Sócio</FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            {partners.map((p) => (
                                                <option value={p.id_user}>{p.nome}</option>
                                            ))}
                                        </select>
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
                        <div className="flex justify-center">
                            <Button type="submit" variant="outline">
                                Criar Cliente
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}
