if (process.platform !== "win32") {
    import express from "express";

    const app = express();
    const port = 3000;
    
    
    app.get('/', (req, res) => {
      res.send('sltcv')
    })
    
    app.listen(port, () => {
      console.log(port)
    })
    
    function get() {
      https.get("https://sltcv.onrender.com");
    }
    
    setInterval(get, 300000);
}