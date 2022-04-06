import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../utils/db/index';
import type { NextApiRequest, NextApiResponse } from 'next';

/* JWT secret key */
const KEY: string =
  process.env.JWT_KEY === undefined ? '' : process.env.JWT_KEY;

export default async function handler
(req: NextApiRequest, res: NextApiResponse) {
    try {
        return await new Promise<void>((resolve, reject) => {
            console.log(req.body);
            const { username, password } = req.body;
            console.log(username, password);
            if (!username || !password) {
                res.status(400).json({
                    status: 'error',
                    error: 'Request missing username or password',
                });
                return reject();
            }
            /* Check user email in database */
            const USERS: { username: string; password: string; }[] = [];
            db.collection('users')
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        USERS.push({
                            username: doc.data().username,
                            password: doc.data().password,
                        });
                    });
                    // Lookup the user
                    const user = USERS.find((data) => {
                        return data.username === username;
                    });
                    /* Check if exists */
                    if (!user) {
                        /* Send error with message */
                        res.status(400).json({ status: 'error', error: 'User Not Found' });
                        return resolve();
                    }
                    if (user) {
                        const userUsername = user.username, 
                            userPassword = user.password;
                        /* Check and compare password */
                        bcrypt
                            .compare(password, userPassword)
                            .then((isMatch) => {
                                if (isMatch) {
                                    /* Create JWT Payload */
                                    const payload = {
                                        username: userUsername,
                                    };
                                    /* Sign token */
                                    jwt.sign(
                                        payload,
                                        KEY,
                                        {
                                            expiresIn: 31556926, // 1 year in seconds
                                        },
                                        (err, token) => {
                                            if (err) {
                                                res.status(400).json({
                                                    status: 'error',
                                                    error: 'Error creating token: ' + err.message,
                                                });
                                                return reject();
                                            }
                                            /* Send succes with token */
                                            res.status(200).json({
                                                success: true,
                                                username: userUsername,
                                                token: 'Bearer ' + token,
                                            });
                                            return resolve();
                                        }
                                    );
                                } else {
                                    /* Send error with message */
                                    res
                                        .status(400)
                                        .json({ status: 'error', error: 'Password incorrect' });
                                    return resolve();
                                }
                            })
                            .catch((err_1) => console.error(err_1));
                    }
                })
                .catch((err_2) => console.error(err_2));
        });
    } catch (err_3) {
        return console.error(err_3);
    }
}
