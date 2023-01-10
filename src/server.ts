import dotenv from 'dotenv';
import server from './index';
dotenv.config();

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`It's alive on port ${PORT}`);
});
