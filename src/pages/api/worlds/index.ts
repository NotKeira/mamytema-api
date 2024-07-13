import {pool} from '@/lib/db';

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return getWorlds(req, res);
        case 'POST':
            return addWorld(req, res);
        default:
            return res.status(405).end(); // Method Not Allowed
    }
}

const getWorlds = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM worlds');
        return res.status(200).json(rows);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const addWorld = async (req, res) => {
    try {
        const {id, name, owner_id, permissions, placed, type, banned} = req.body;
        const [result] = await pool.query('INSERT INTO worlds (id, name, owner_id, permissions, placed, type, banned) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, owner_id, JSON.stringify(permissions), JSON.stringify(placed), type, JSON.stringify(banned)]);
        return res.status(201).json({id: result.insertId, name, owner_id, permissions, placed, type, banned});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};