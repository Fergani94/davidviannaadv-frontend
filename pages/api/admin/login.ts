import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { API_BASE_URL } from '../../../lib/constants';

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: 'Informe e-mail e senha' });
    return;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password }, { timeout: 90000 });
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    res.setHeader('Set-Cookie', `auth_token=${response.data.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SEVEN_DAYS}${secure}`);
    res.status(200).json({ success: true });
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401) {
      res.status(401).json({ error: 'E-mail ou senha inválidos' });
    } else {
      res.status(502).json({ error: 'Não foi possível entrar agora. Tente novamente em instantes.' });
    }
  }
}
