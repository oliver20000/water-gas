import express, { Request, Response, NextFunction } from 'express';
import measurementRoutes from './routes/measurementRoutes';

const app = express();
const PORT = process.env.PORT || 3000;


app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Recebida: ${req.method} ${req.originalUrl}`);
    next();
});


app.use(express.json());


app.use('/api', measurementRoutes);


app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
        
        const methods = Object.keys(middleware.route.methods).map((method) => method.toUpperCase()).join(', ');
        console.log(`${methods} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        
        middleware.handle.stack.forEach((handler: any) => {
            const methods = Object.keys(handler.route.methods).map((method: string) => method.toUpperCase()).join(', ');
            console.log(`${methods} ${middleware.regexp}${handler.route.path}`);
        });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


app.use((req, res, next) => {
    console.log(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Rota não encontrada' });
});