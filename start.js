const { execSync } = require('child_process');
const port = process.env.PORT || 5000;
execSync(`npx next start -p ${port} -H 0.0.0.0`, { stdio: 'inherit' });
