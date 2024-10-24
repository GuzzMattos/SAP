"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import InputMask from 'react-input-mask';
import { ChangeEvent, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createFamiliar } from "@/app/_actions/familiar";
import { FamiliarSchema, TFamiliarSchema } from "@/lib/schemas/familiar";
import { parse, isValid, format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";





interface IFamiliarForm {
    clientId: string;
}

export default function FamiliarForm({ clientId }: IFamiliarForm) {
    const form = useForm<TFamiliarSchema>({
        resolver: zodResolver(FamiliarSchema),
        defaultValues: {
            cpf: "",
            est_civil: "Solteiro",
            nome: "",
            data_nasc: new Date(),
            vivo: true,
            nome_conj: "",
            parentesco: "",
        },
    });

    async function onSubmit(values: TFamiliarSchema) {
        console.log("onSubmit called");
        console.log("Form values:", values);
        try {
            await createFamiliar(clientId, values);
            // Handle success (e.g., show a success toast)
        } catch (error) {
            console.error("Erro na requisição:", error);
            // Handle error (e.g., show an error toast)
        }
    }

    return (
        <main className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-2xl">
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
                            name="cpf"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className=" text-gray-800 mb-2">CPF</FormLabel>
                                    <FormControl className="border-gray-300">
                                        <InputMask
                                            mask="999.999.999-99"
                                            placeholder="CPF"
                                            className="border-gray-300 bg-gray-100 text-gray-800 w-full p-2 rounded-md" // Adicione as mesmas classes aqui
                                            value={field.value}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="data_nasc"
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

                        <FormField
                            control={form.control}
                            name="est_civil"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800">Estado Civil</FormLabel>
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
                                        <FormLabel className="text-gray-800">Nome do Cônjuge</FormLabel>
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
                                    <FormLabel className="text-gray-800">Está Vivo</FormLabel>
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
                            name="parentesco"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800">Parentesco</FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <option value="Outro Parentesco">Selecione um parentesco</option>
                                            <option value="Avô">Avô</option>
                                            <option value="Avó">Avó</option>
                                            <option value="Pai">Pai</option>
                                            <option value="Mãe">Mãe</option>
                                            <option value="Filho(a)">Filho/Filha</option>
                                            <option value="Irmão/Irmã">Irmão/Irmã</option>
                                            <option value="Neto/Neta">Neto/Neta</option>
                                            <option value="Bisneto/Bisneta">Bisneto/Bisneta</option>


                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className="flex justify-center">
                            <Button type="submit" variant="outline">
                                Criar Familiar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}