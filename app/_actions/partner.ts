"use server"

import { PartnerSchema } from "@/lib/schemas/partner";
import { z } from "zod";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

// CRUD -> create. read. update. delete

export async function createPartner(values: z.infer<typeof PartnerSchema>) {

    const userExists = await prisma.usuario.findUnique({
        where: {
            cpf: values.cpf
        }
    })

    if (userExists) {
        throw new Error("Usuário com esse CPF já existe.")
    }

    const newPartner = await prisma.usuario.create({
        data: {
            nome: values.nome,
            cpf: values.cpf,
            email: values.email,
            senha: values.senha,
            tipo: values.tipo
        }
    })

    console.log({ newPartner })

    redirect("/admin/partners")
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


export async function updatePartner(values: z.infer<typeof PartnerSchema>) {

    // ACHA O USUARIO
    const user = await prisma.usuario.findUnique({
        where: {
            cpf: values.cpf
        }
    })

    // VERIFICA SE EXISTE
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    // SE EXISTE ATUALIZA
    const updatedPartner = await prisma.usuario.update({
        where: {
            id_user: user.id_user,
        },
        data: {
            cpf: values.cpf,
            email: values.email,
            nome: values.nome,
            senha: values.senha,
            tipo: values.tipo
        }
    })

    console.log({ updatedPartner })
}

export async function deletePartner(partnerId: string) {
    const user = await prisma.usuario.findUnique({
        where: {
            id_user: partnerId
        }
    })

    // VERIFICA SE EXISTE
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    // SE EXISTE EXCLUI
    await prisma.usuario.delete({
        where: {
            id_user: partnerId
        }
    });
    console.log("Partner deleted");

    return true;
}