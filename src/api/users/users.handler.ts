/*

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	"firstName" VARCHAR(255) NOT NULL,
	"lastName" VARCHAR(255) NOT NULL,
	age INT,
    role VARCHAR(255) NOT NULL
);

*/

import { Request, Response, NextFunction } from "express";
import { pool } from "../../db/postgresql";
import { User, UserPathParameter, UserQueryParameter } from "./users.model";

export async function findAll(
    req: Request<{}, {}, {}, UserQueryParameter>,
    res: Response,
    next: NextFunction
) {
    const requestedUserAge = req.query.age;
    const requestedUserRole = req.query.role;

    let filterString = "";
    let filterParameters = [];

    if (requestedUserAge && requestedUserRole) {
        filterString = "WHERE age = $1 AND role = $2";
        filterParameters.push(requestedUserAge);
        filterParameters.push(requestedUserRole);
    } else if (requestedUserAge) {
        filterString = "WHERE age = $1";
        filterParameters.push(requestedUserAge);
    } else if (requestedUserRole) {
        filterString = "WHERE role = $1";
        filterParameters.push(requestedUserRole);
    }

    try {
        let { rows } = await pool.query(
            "SELECT * FROM users " + filterString,
            filterParameters
        );
        res.json(rows);
    } catch (error) {
        next(error);
    }
}

export async function findOne(
    req: Request<UserPathParameter>,
    res: Response,
    next: NextFunction
) {
    const userId = req.params.id;

    try {
        let { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
            userId,
        ]);
        if (rows.length != 1) {
            res.status(404);
            throw new Error(`Failed to find the user with id ${userId}.`);
        }
        res.json(rows);
    } catch (error) {
        next(error);
    }
}

export async function createOne(
    req: Request<{}, {}, User>,
    res: Response,
    next: NextFunction
) {
    try {
        let result = await pool.query(
            'INSERT INTO users ("firstName", "lastName", age, role) VALUES ($1, $2, $3, $4)',
            Object.values(req.body)
        );
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function updateOne(
    req: Request<UserPathParameter, {}, User>,
    res: Response,
    next: NextFunction
) {
    const userId = req.params.id;

    try {
        let result = await pool.query(
            'UPDATE users SET "firstName"=$1, "lastName"=$2, age=$3, role=$4 WHERE id=$5',
            [...Object.values(req.body), userId]
        );
        if (result.rowCount != 1) {
            res.status(404);
            throw new Error(`Failed to update the user with id ${userId}.`);
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteOne(
    req: Request<UserPathParameter, {}, User>,
    res: Response,
    next: NextFunction
) {
    const userId = req.params.id;

    try {
        let result = await pool.query("DELETE FROM users WHERE id=$1", [
            userId,
        ]);
        if (result.rowCount != 1) {
            res.status(404);
            throw new Error(`Failed to delete the user with id ${userId}.`);
        }
        res.status(204).json(result);
    } catch (error) {
        next(error);
    }
}
