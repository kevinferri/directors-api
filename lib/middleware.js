var middleware = function() {

  var self = this;

  self.responses = {
    invalidId: function(id){
      return {
        name: 'InvalidId',
        message: id + ' is not a valid ID'
      }
    }
  };

  self.isValidId = function(req, res, next) {
    var id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return next();
    } else {
      res
        .status(400)
        .json(self.responses.invalidId(id));
    }
  };

}

module.exports = new middleware();