import {NextApiRequest, NextApiResponse} from "next";
import {pool} from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getUsers(req, res);
        case 'POST':
            return createUser(req, res);
        default:
            return res.status(405).end(); //-- 405 Method Not Allowed
    }
}

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const {roblox, discord, level} = req.body;
        const [result] = await pool.query('INSERT INTO users (roblox,discord,level) VALUES (?,?,?)', [roblox, discord, level]);
        return res.status(201).json({id: result.insertId, roblox, discord, level});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};