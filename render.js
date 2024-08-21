if (process.platform !== "win32") {
    const express = require('express')
    const app = express()
    const port = 3000
    
    // http://localhost:3000/screenshot1.png
    
    app.use(express.static("screenshots"));
    
    app.get('/', (req, res) => {
      res.send('sltcv')
    })
    
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
    
    function ftg() {
      https.get("https://sltcv.onrender.com");
    }
    
    setInterval(ftg, 300000);
}