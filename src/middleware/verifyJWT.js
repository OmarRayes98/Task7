const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyJWT = async(req, res, next) => {
  // get AccessToken from header 
  const authHeader = req.headers.authorization || req.headers.Authorization; // "Bearer token"

  //Unauthorized : you don't login
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ status:401, message: "No token, Unauthorized" });
  }
  
  const token = authHeader.split(" ")[1]; // ["Bearer","token"] to get the value "token"

  
  //is still accessToken works (expires still works)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, decoded) => {
    
    //accessToken has expired 
    if (err) return res.status(403).json({status:403, message: "Forbidden ,accessToken has expired" });
    
    //it works continue to invoke next api 
    // Attach the user to the request object
    try{
        req.user = await User.findById(decoded.id);
    }catch(error){
        res.status(401).json({ status:401, message: 'Invalid token' });
    }

    next();
  });
};

module.exports = verifyJWT;
