import { useExpressServer } from 'routing-controllers';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

const PORT: number = 9000;

let app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({ secret: "secret", saveUninitialized: false, resave: false }));

const controllerPath = path.resolve('src', 'controller', '*.ts');
const adminControllerPath = path.resolve('src', 'controller', 'admin', '*.ts');

useExpressServer(app, {
    defaultErrorHandler: true,
    routePrefix: '/api',
    controllers: [controllerPath, adminControllerPath],
});

app.listen(PORT, () => {
    return console.log(`Express is listening at http://localhost:${PORT}`);
});




