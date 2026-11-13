import express, { Router } from 'express';
import compression from 'compression';
import path from 'node:path';

interface Options {
  port: number;
  public_path?: string;
  routes: Router;
}

export class Server {
  private app = express();
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, public_path = 'public', routes } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {

    //* middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded()); // x-www-form-urlencoded
    this.app.use(compression())

    //* public folder
    this.app.use(express.static(this.publicPath));

    //* routes
    this.app.use(this.routes);

    //* SPA
    this.app.get('/*splat', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
      return;
    });

    this.app.listen(this.port, () => {
      console.log(`servidor corriendo en el puerto ${this.port}`);
    });
  }
}