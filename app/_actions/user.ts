"use server";

import { UserRole } from "@/lib/links";
import { LoginSchema } from "@/lib/schemas/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { setTimeout } from "timers/promises";
import { z } from "zod";

export async function LoginAction(values: z.infer<typeof LoginSchema>) {
  const week = 60 * 60 * 24 * 7

  // TODO: login proposital RETIRAR QUANDO FOR PARA PRODUÇÃO
  await setTimeout(1000)

  if (values.email === "teste@gmail.com" && values.password === "testeteste1") {
    cookies().set("user", JSON.stringify({
      email: values.email,
      role: "admin"
    }), {
      httpOnly: true,
      maxAge: week,
      secure: true
    })

    redirect("/admin/dashboard?success=true")
  }

  return {
    error: "Senha ou email incorretos"
  }
}

export async function GetUserRole() {
  const userCookie = cookies().get("user")?.value

  if (userCookie) {
    const user = JSON.parse(userCookie);
    return user.role as UserRole;
  }

  return null
}

export async function LogoutAction() {
  cookies().delete("user")

  redirect("/?logout=true")
}