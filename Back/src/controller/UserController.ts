import { JsonController, Param, Body, Get, Post, Put, Delete, Req, UseBefore, Patch, Res } from 'routing-controllers';
import { Response } from 'express';
import { AppDataSource } from '../db/data-source';
import { User } from '../entity/User';
import * as jwt from "jsonwebtoken";

@JsonController()
export class UserController {
    
    constructor(private userRepository) {
        this.userRepository = AppDataSource.getRepository(User);
    }

    @Post("/register")
    public async register(@Body() data: User) {
        try {
            // verif object existing in data source
            const hasAccountWithEmail: User = await this.userRepository.findOne({ where: { email: data.getMail() } });
            if (hasAccountWithEmail) throw new Error('Account existing. Please Login');

            // create object with condition
            const user: User = data;
            if (!user) throw new Error('Account not created');

            await this.userRepository.save(user);

            return { success: "Account created" };
        } catch (error) {
            return { error: error.message };
        }
    }

    @Post("/login")
    public async login(@Body() data: User, @Req() req: any, @Res() res: Response) {
        try {
            // find object in data source
            const user: User = await this.userRepository.findOne({ where: { email: data.getMail() } });
            if (!user){
                return res.status(400).json({ error: "User not found" });
            }
            req.session.token = await jwt.sign({
                id: user.getId(),
            }, "bc042227-9f88-414d", {
                expiresIn: "24h"
            });

            if (!req.session.token) throw new Error('Error authentication');
            return { success: "Account login", token: req.session.token};

        } catch (error) {
            return { error: error.message };
        }
    }

    @Delete("/logout")
    public async logout(@Req() req: any) {
        try {
            if (!req.session.token) throw new Error('Unable to logout');

            req.session.destroy();

            return { success: "Logout with success" };
        } catch (error) {
            return { error: error.message };
        }
    }
}