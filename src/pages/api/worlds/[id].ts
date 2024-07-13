import {pool} from '@/lib/db';
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;
    switch (req.method) {
        case 'GET':
            return getWorld(req, res, id);
        case 'PUT':
            return updateWorld(req, res, id);
        case 'DELETE':
            return deleteWorld(req, res, id);
        default:
            return res.status(405).end(); // Method Not Allowed
    }
}

const getWorld = async (req: NextApiRequest, res: NextApiResponse, id: string | string[] | undefined) => {
    try {
        const [rows] = await pool.query('SELECT * FROM worlds WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'World not found'});
        }
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const updateWorld = async (req: NextApiRequest, res: NextApiResponse, id: string | string[] | undefined) => {
    try {
        const {name, owner_id, permissions, placed, type, banned} = req.body;
        const [result] = await pool.query('UPDATE worlds SET name = ?, owner_id = ?, permissions = ?, placed = ?, type = ?, banned = ? WHERE id = ?', [name, owner_id, JSON.stringify(permissions), JSON.stringify(placed), type, JSON.stringify(banned), id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'World not found'});
        }
        return res.status(200).json({id, name, owner_id, permissions, placed, type, banned});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const deleteWorld = async (req: NextApiRequest, res: NextApiResponse, id: string | string[] | undefined) => {
    try {
        const [result] = await pool.query('DELETE FROM worlds WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'World not found'});
        }
        return res.status(204).end(); // No Content
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};
