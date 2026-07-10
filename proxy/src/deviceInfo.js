const useragent = require('useragent');
const deviceInfo = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Récupérer le User-Agent
    const userAgent = req.headers['user-agent'];
    const agent = useragent.parse(userAgent);


    const deviceInfo = {
        ip: ip,
        device: {
            vendor: agent.os,
            model: agent.device,
            browser: agent.toString(),
            os: agent.os.toString()
        }
    };
      console.log(deviceInfo);
    
    req.deviceInfo = deviceInfo;
    next();
};
module.exports=deviceInfo