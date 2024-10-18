import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CDI_API_URL = "http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='BM12_TJCDI12')";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await axios.get(CDI_API_URL);
        const data = response.data.value;

        if (data && data.length > 0) {
            // Ordena os dados pela data mais recente
            const latestData = data.sort((a: any, b: any) => new Date(b.VALDATA).getTime() - new Date(a.VALDATA).getTime())[0];
            const valor = parseFloat(latestData.VALVALOR);

            // Atualiza ou cria um registro na tabela indices
            await prisma.indices.upsert({
                where: { nome: 'CDI' },
                update: { valor },
                create: { nome: 'CDI', valor },
            });

            res.status(200).json({ message: 'CDI atualizado com sucesso' });
        } else {
            res.status(400).json({ message: 'Dados indisponíveis' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar o CDI' });
    }
}
