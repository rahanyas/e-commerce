
const verifyUser = (req, res, next) => {
    if(req.session.user){
      next();
    }else{
      res.render('userPages/index', {
           error: 'please login',
            success : null,
           })
    }
};

export default verifyUser;
