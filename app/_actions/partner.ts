"use server"

import { PartnerSchema } from "@/lib/schemas/partner";
import { z } from "zod";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

// CRUD -> create. read. update. delete

export async function createPartner(values: z.infer<typeof PartnerSchema>) {

    // Verifique se o CPF já existe
    const userExistsByCpf = await prisma.usuario.findUnique({
        where: {
            cpf: values.cpf
        }
    });

    if (userExistsByCpf) {
        throw new Error("Usuário com esse CPF já existe.");
    }

    // Verifique se o email já existe
    const userExistsByEmail = await prisma.usuario.findUnique({
        where: {
            email: values.email
        }
    });

    if (userExistsByEmail) {
        throw new Error("Usuário com esse email já existe.");
    }

    // Criação do novo parceiro
    const newPartner = await prisma.usuario.create({
        data: {
            nome: values.nome,
            cpf: values.cpf,
            email: values.email,
            senha: values.senha,
            tipo: values.tipo
        }
    });

    console.log({ newPartner });

    // Redirecionar após a criação bem-sucedida
    redirect("/admin/partners");
}


export async function getAllPartners() {
    const allPartners = await prisma.usuario.findMany({})

    return allPartners;
}
export type TPartner = Awaited<ReturnType<typeof getAllPartners>>;

export async function getPartnerById(partnerId: string) {
    const user = await prisma.usuario.findUnique({
        where: {
            id_user: partnerId
        }
    })

    // VERIFICA SE EXISTE
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    return user;
}
export type TPartnerById = Awaited<ReturnType<typeof getPartnerById>>;



export async function deletePartner(partnerId: string) {
    // Verifica se o usuário (partner) existe
    const user = await prisma.usuario.findUnique({
        where: {
            id_user: partnerId
        }
    });

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    // Verifica se o partner possui clientes associados
    const associatedClients = await prisma.cliente.findFirst({
        where: {
            id_user: partnerId
        }
    });

    if (associatedClients) {
        throw new Error("Não é possível deletar o sócio, pois ele possui clientes vinculados.");
    }

    // Se não houver clientes associados, exclui o partner
    await prisma.usuario.delete({
        where: {
            id_user: partnerId
        }
    });
    console.log("Partner deleted");

    return true;
}

export async function updatePartner(id: string, values: z.infer<typeof PartnerSchema>) {
    // ACHA O USUÁRIO PELO ID
    const user = await prisma.usuario.findUnique({
        where: {
            id_user: id
        }
    });

    // VERIFICA SE EXISTE
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    // SE EXISTE, ATUALIZA
    const updatedPartner = await prisma.usuario.update({
        where: {
            id_user: id
        },
        data: {
            nome: values.nome,
            cpf: values.cpf,
            email: values.email,
            senha: values.senha,
            tipo: values.tipo
        }
    });

    console.log({ updatedPartner });

    return updatedPartner;
}
export async function updatePartnerById(partnerId: string, values: z.infer<typeof PartnerSchema>) {
    // Verifica se o usuário (partner) existe pelo ID
    const existingPartner = await prisma.usuario.findUnique({
        where: {
            id_user: partnerId
        }
    });

    if (!existingPartner) {
        throw new Error("Usuário não encontrado");
    }

    const updatedData: any = {
        nome: values.nome,
        cpf: values.cpf,
        email: values.email,
        tipo: values.tipo,
    };

    // Atualiza a senha apenas se for fornecida
    if (values.senha) {
        updatedData.senha = values.senha;
    }

    // Atualiza os dados no banco
    const updatedPartner = await prisma.usuario.update({
        where: { id_user: partnerId },
        data: updatedData,
    });

    console.log("Partner atualizado:", updatedPartner);
    return updatedPartner;
}