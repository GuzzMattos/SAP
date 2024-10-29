import { NextResponse } from "next/server"
import { GetRelatedClients } from "../_actions/user"

export async function GET() {
    const aa = await GetRelatedClients()

    return NextResponse.json(aa)
}