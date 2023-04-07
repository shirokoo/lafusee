import {ExpressMiddlewareInterface} from 'routing-controllers';
import * as jwt from 'jsonwebtoken';

export class Authentification implements ExpressMiddlewareInterface {

    use(req: any, res: any, next?: (err?: any) => any): any {
        try {
            const token = req.session.token;
            if (!token) return res.status(401).json({error: "Please login."});

            // @ts-ignore
            const decodeToken = jwt.decode(token, "bc042227-9f88-414d");
            const id = decodeToken.id;

            req.auth = {id};

        } catch (error) {
            return {error: "Unauthorized"};
        }
        
        next();
    }
}