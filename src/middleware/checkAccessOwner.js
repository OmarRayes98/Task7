
// Middleware to check if the user is authorized to update a resource
const checkAccessOwner = (Model,nameModel) => {

    return async (req, res, next) => {
      try {
        const { id } = req.params; // Get the resource ID from the URL
        const userIdFromRequest = req.user._id.toString(); // Assume user ID is obtained from the authenticated user
        console.log(userIdFromRequest,"userIdFromRequest")
        // Find the resource by ID
        const model = await Model.findById(id);
        if (!model) {
          return res.status(404).json({ message: `${nameModel} not found` });
        }
  
        // Check if the user ID matches the user ID associated with the resource
        if (model.user_id.toString() !== userIdFromRequest) {
          console.log("model.user_id.toString()",model.user_id.toString())
          return res.status(403).json({ message: `You are not authorized to update this ${nameModel}.` });
        }
  
        // If the user is authorized, proceed to the next middleware/handler
        next();
      } catch (error) {
        // authentication
        res.status(401).json({ message: "Invalid token" });
      }
    };
  };
  
  module.exports = checkAccessOwner;