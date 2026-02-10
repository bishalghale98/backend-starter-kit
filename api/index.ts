import app from '../src/app';
import { prisma } from '../src/config/dbConnect';

app.get('/api/vhealth', async (req, res) => {
    const users = await prisma.user.findMany({ take: 1 })
    res.json({ ok: true, users })
})

export default app;
