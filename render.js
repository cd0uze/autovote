
    import express from "express";

    const app = express();
    const port = 3000;
    
    
    app.get('/', (req, res) => {
      res.send("Testing...")
    })
    
    app.listen(port, () => {
      console.log(port)
    })
    
    function get() {
      https.get("https://autovote.onrender.com");
    }
    
    setInterval(get, 300000);
