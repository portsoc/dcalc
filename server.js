import express from 'express';
import fetch from 'node-fetch';
import { promises as fs} from 'fs';

const app = express();

app.use(express.static('client'));

// utility fn to load a json file (oh how it was easy when we could just `require`)
const load = async (file) => JSON.parse( await fs.readFile(file, "utf8") );

const data = await load('./config/data.json');
const options = { headers: await load('./config/headers.json') };

app.all('*', async (req, res) => {
  console.log(`Request: ${req.path}`);
  const route = req.path;
  const gatewayUrl = 'https://t-esbprep-apigw.port.ac.uk/gateway/BiDataWarehouseSitsCourseModuleAssessmentAPI';
  const gatewayRequestUrl = gatewayUrl + route + data.years.sep22;
  
  try {
    const response = await fetch(gatewayRequestUrl, headers);
    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(80, function() {
  console.log("server enabled");
});
