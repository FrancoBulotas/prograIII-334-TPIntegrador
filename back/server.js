
import app from './src/api/index.js'
import env from './src/api/config/environments.js';

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`Servidor local corriendo en puerto ${PORT}`);
});