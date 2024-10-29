"use server";

import { UserRole } from "@/lib/links";
import { LoginSchema } from "@/lib/schemas/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function LoginAction(values: z.infer<typeof LoginSchema>) {
  const week = 60 * 60 * 24 * 7

  const user = await prisma.usuario.findFirst({
    where: {
      AND: [
        { email: values.email },
        { senha: values.password }
      ]
    },
    select: {
      tipo: true,
      nome: true,
      id_user: true
    }
  });

  if (!user) {
    return {
      error: "Senha ou email incorretos"
    }
  }

  cookies().set("user", JSON.stringify({
    email: values.email,
    name: user.nome,
    role: user.tipo,
    id: user.id_user
  }), {
    httpOnly: true,
    maxAge: week,
    secure: true
  })

  redirect("/admin/dashboard?success=true")
}

export async function GetUserRole() {
  const userCookie = cookies().get("user")?.value

  if (userCookie) {
    const user = JSON.parse(userCookie);
    return user.role as UserRole;
  }

  return null
}

export async function GetUserName() {
  const userCookie = cookies().get("user")?.value

  if (userCookie) {
    const user = JSON.parse(userCookie);
    return user.name
  }

  return null
}

export async function GetUserId() {
  const userCookie = cookies().get("user")?.value

  if (userCookie) {
    const user = JSON.parse(userCookie);
    return user.id
  }

  return null
}

export async function LogoutAction() {
  cookies().delete("user")

  redirect("/?logout=true")
}

export async function GetRelatedClients() {
  const role = await GetUserRole()
  const userId = await GetUserId()

  let whereCondition: Prisma.ClienteWhereInput = {}

  if (role !== "admin") {
    whereCondition = {
      id_user: {
        equals: userId
      }
    }
  }

  const allClients = await prisma.cliente.findMany({
    where: whereCondition,
    include: {
      Investimento: true
    },
  })

  const clientsWithInvestmentTotal = allClients.map(client => {
    const totalInvestment = client.Investimento.reduce((acc, invest) => acc + invest.valor, 0);

    return {
      ...client,
      totalInvestment,
    };
  });

  return {
    clientsWithInvestmentTotal,
  };
}