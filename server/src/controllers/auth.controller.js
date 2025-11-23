import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";

export const register = async (req, res) => {
    const {name, email, password}  = req.body;

    try{
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {name, email, password: hashed}
        });

        res.json({message: "User registered successfully", userId: user.id});
    } catch (err) {
        res.status(400).json({error: error.message});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await prisma.user.findUnique({where: {email}});
        if(!user) return res.status(400).json({message: "user does not exist"});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({message: "invalid credentials"});

        const token = jwt.sign(
            {id: user.id, email: user.email}.emailprocess.env.JWT_SECERET,{expiresIn: "7d"}
        );

        res.json({token, user});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}