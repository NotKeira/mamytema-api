import {pool} from "@/lib/db";
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;
    switch (req.method) {
        case 'GET':
            return getUser(req, res, id);
        case 'PUT':
            return updateUser(req, res, id);
        case 'DELETE':
            return deleteUser(req, res, id);
        default:
            return res.status(405).end(); //-- 405 Method Not Allowed
    }
};

const getUser = async (req: NextApiRequest, res: NextApiResponse, id: string | string[] | undefined) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE roblox = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse, id: string | string[] | undefined) => {
    try {
        const {data} = req.body;
        const dataKeys = Object.keys(data);
        const dataValues = Object.values(data);
        const dataToUpdate = dataKeys.map((key, index) => `${key} = ?`).join(', ');
        const query = `UPDATE users
                       SET ${dataToUpdate}
                       WHERE roblox = ?`;
        const [result] = await pool.query(query, [...dataValues, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({id, ...data});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

const deleteUser = async (req: NextApiRequest, res: NextApiResponse, id: string | string[] | undefined) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE roblox = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(204).end(); //-- 204 No Content
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};