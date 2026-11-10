import express from 'express';
import path from 'node:path';

export class Server {
  private app = express();

  async start() {

    //* middlewares

    //* public folder
    this.app.use(express.static('public'));

    this.app.get('/*splat', (req, res) => {
      const indexPath = path.join(__dirname + '../../../public/index.html');
      res.sendFile(indexPath);
      return;
    });

    this.app.listen(3000, () => {
      console.log(`servidor corriendo en el puerto 3000`);
    });
  }
}