"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputMask from 'react-input-mask';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createInvestiment } from "@/app/_actions/investiment";
import { InvestimentSchema, TInvestimentSchema } from "@/lib/schemas/investiment";
import React, { ChangeEvent, useState } from 'react';
import { parse, isValid, format } from "date-fns";
import { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { countries } from "@/lib/countries";
import { bancos } from "@/lib/bancos";
import { TIndice } from "@/app/_actions/indice";
import CurrencyInput, { CurrencyInputProps, CurrencyInputOnChangeValues } from 'react-currency-input-field';
import jQuery from "jquery";
import HelperDialog from "@/components/helper-dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RouterBackButton from "@/components/router-back-button";



interface IInvestimentForm {
    clientId: string;
    indice: TIndice;
}

export default function InvestimentForm({ clientId, indice }: IInvestimentForm) {
    const form = useForm<TInvestimentSchema>({
        resolver: zodResolver(InvestimentSchema),
        defaultValues: {
            id_cliente: clientId,
            banco: "",
            agencia: "",
            conta: "",
            classe: "",
            sub_classe_atv: "",
            setor_ativ: "",
            liquidez: "",
            data_aplic: new Date(),
            data_venc: new Date(),
            id_indice: '',
            porc_indice: 0,
            pre_fixado: 0,
            isento: false,
            pais: "",
            valor: 0,
            ativo: true,
        },
    });



    async function onSubmit(values: TInvestimentSchema) {
        console.log("onSubmit called");
        console.log("Form values:", values);
        try {
            await createInvestiment(clientId, values);
            // Handle success (e.g., show a success toast)
        } catch (error) {
            console.error("Erro na requisição:", error);
            // Handle error (e.g., show an error toast)
        }
    }

    return (
        <main className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
            <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                    <RouterBackButton />
                    <div className="text-gray-700 font-bold pb-3 text-3xl">Adicionar Investimento</div>

                    <HelperDialog title='Adicionar Investimento'>

                        {/* Conteúdo da ajuda aqui */}
                        <div>
                            <div>
                                <p><strong>Banco</strong> (Obrigatório): Selecione o banco responsável pelo investimento a partir da lista de opções disponíveis.</p>
                            </div>
                            <div>
                                <p><strong>Agência</strong> (Obrigatório): Informe o número da agência bancária onde o investimento está registrado.</p>
                            </div>
                            <div>
                                <p><strong>Conta</strong> (Obrigatório): Insira o número da conta onde o investimento será associado.</p>
                            </div>
                            <div>
                                <p><strong>Classe</strong> (Obrigatório): Escolha a classe do investimento.</p>
                                <div>
                                    <p><strong>Subclasse</strong> (Obrigatório): Selecione uma subclasse que especifica o tipo de investimento dentro da classe selecionada.</p>
                                </div>
                                <div>
                                    <p><strong>Setor de Atividade</strong> (Obrigatório): Descreva o setor de atividade que se relaciona com o investimento, como setor financeiro, industrial, ou de tecnologia.</p>
                                </div>
                                <div>
                                    <p><strong>Liquidez</strong> (Obrigatório): Informe a liquidez do investimento, que representa a facilidade de converter o ativo em dinheiro. Por exemplo, se o investimento possui liquidez diária ou mensal.</p>
                                </div>
                                <div>
                                    <p><strong>Data da Aplicação</strong> (Obrigatório): Insira a data em que o investimento foi realizado. Utilize o formato de data padrão (DD/MM/AAAA).</p>
                                </div>
                                <div>
                                    <p><strong>Data do Vencimento</strong> (Obrigatório): Informe a data de vencimento do investimento, ou seja, quando ele será finalizado ou resgatado.</p>
                                </div>
                                <div>
                                    <p><strong>Índice</strong> (Opcional): Selecione um índice de referência para o investimento, como o CDI, IPCA, ou outro, caso o rendimento esteja atrelado a algum índice econômico.</p>
                                </div>
                                <div>
                                    <p><strong>Porcentagem do Índice</strong> e <strong>Pré-Fixado</strong> (Opcional): Defina a porcentagem do índice escolhido que será aplicada ao rendimento do investimento. Se for um investimento pré-fixado, indique a taxa fixa aplicável.</p>
                                </div>
                                <div>
                                    <p><strong>Isento</strong> (Obrigatório): Escolha se o investimento é isento de impostos. Marque "Sim" ou "Não" conforme a situação fiscal.</p>
                                </div>
                                <div>
                                    <p><strong>País</strong> (Obrigatório): Selecione o país onde o investimento está localizado ou registrado.</p>
                                </div>
                                <div>
                                    <p><strong>Valor</strong> (Obrigatório): Insira o valor do investimento. Esse é o valor total aplicado.</p>
                                </div>
                                <div>
                                    <p><strong>Nota:</strong> Os campos marcados com "*" são obrigatórios.</p>
                                </div>
                            </div>

                        </div>
                    </HelperDialog>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="banco"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Banco <div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <option value="" disabled>
                                                Selecione um Banco
                                            </option>
                                            <option value="xp">XP Investimentos</option>
                                            <option value="bradesco">Bradesco</option>
                                            <option value="itau">Itaú</option>
                                            <option value="nubank">Nubank</option>
                                            <option value="c6">C6 Bank</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="agencia"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Agência<div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <InputMask
                                            mask="9999-9" // Máscara para a agência
                                            placeholder="Agência"
                                            className="border-gray-300 bg-gray-100 text-gray-800 w-full p-2 rounded-md"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="conta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Conta <div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <InputMask
                                            mask="99999-9" // Máscara para a conta
                                            placeholder="Conta"
                                            className="border-gray-300 bg-gray-100 text-gray-800 w-full p-2 rounded-md"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="classe"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Classe<div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value}
                                            onChange={field.onChange}
                                        ><option value="" disabled>
                                                Selecione uma classe
                                            </option>
                                            <option value="fixa">Renda Fixa</option>
                                            <option value="variavel">Renda Variável</option>

                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sub_classe_atv"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Subclasse<div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <option value="" disabled>
                                                Selecione uma sub-classe
                                            </option>
                                            <option value="cdb">CDB</option>
                                            <option value="lc">LCI/LCA</option>
                                            <option value="fis">Fundo de Investimento</option>
                                            <option value="acoes">Ações</option>
                                            <option value="tesouro">Tesouro Nacional</option>
                                            <option value="debenture">Debênture</option>





                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="setor_ativ"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Setor de Atividade </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Setor de Atividade"
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
                            name="liquidez"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Liquidez</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Liquidez"
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
                            name="data_aplic"
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
                                        <FormLabel className="text-gray-800 flex">Data da Aplicação<div className="text-red-600">*</div></FormLabel>
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
                            name="data_venc"
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
                                        <FormLabel className="text-gray-800 flex">Data do Vencimento<div className="text-red-600">*</div></FormLabel>
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
                            name="id_indice" // Alterado para id_indice
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Índice<div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value || ""} // Acesse diretamente field.value
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                field.onChange(selectedId); // Atualiza diretamente com o id_indice
                                            }}
                                        >
                                            <option value="">Selecione um índice</option>
                                            {indice && indice.length > 0 ? (
                                                indice.map((p) => (
                                                    <option key={p.id_indice} value={p.id_indice}>
                                                        {p.nome}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Nenhum índice disponível</option>
                                            )}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex space-x-20"> {/* Flex container com espaço entre os inputs */}
                            <FormField
                                control={form.control}
                                name="porc_indice"
                                render={({ field }) => (
                                    <FormItem className="w-1/6"> {/* Ajuste a largura do FormItem */}
                                        <FormLabel className="text-gray-800 flex whitespace-nowrap">Porcentagem do Índice<div className="text-red-600">*</div></FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Input
                                                    type="currency"
                                                    step="0.01"
                                                    placeholder="Porcentagem do Índice"
                                                    className="border-gray-300 bg-gray-100 text-gray-800 w-full" // w-full para preencher o espaço
                                                    value={field.value !== undefined ? String(field.value) : ""}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                                <span className="ml-2 text-gray-800">%</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pre_fixado"
                                render={({ field }) => (
                                    <FormItem className="w-1/6"> {/* Ajuste a largura do FormItem */}
                                        <FormLabel className="text-gray-800 flex">Pré-Fixado<div className="text-red-600">*</div></FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Pré-Fixado"
                                                    className="border-gray-300 bg-gray-100 text-gray-800 w-full" // w-full para preencher o espaço
                                                    value={field.value !== undefined ? String(field.value) : ""}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                                <span className="ml-2 text-gray-800">%</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Isento<div className="text-red-600">*</div></FormLabel>
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
                            name="pais"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">País<div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <select
                                            className="bg-gray-100 text-gray-800 text-sm border border-gray-300 rounded-md p-2 w-full mt-1"
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <option value="" disabled>
                                                Selecione um País
                                            </option>
                                            {countries.map((country) => (
                                                <option key={country} value={country}>
                                                    {country}
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
                            name="valor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-800 flex">Valor<div className="text-red-600">*</div></FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Valor"
                                            className="border-gray-300 bg-gray-100 text-gray-800"
                                            value={field.value !== undefined ? String(field.value) : ""}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className="flex justify-center">
                            <Button type="submit" variant="outline">
                                Criar Investimento
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    );
}
