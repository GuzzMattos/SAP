import cron from 'node-cron';

export const scheduleCdiUpdate = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            await fetch('http://localhost:3000/api/updateCdi'); // URL local ou de produção
            console.log('CDI atualizado diariamente.');
        } catch (error) {
            console.error('Erro ao agendar a atualização do CDI', error);
        }
    });
};
