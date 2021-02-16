const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productsControllers = require('../controllers/productsControllers');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString() + file.originalname.split(' ').join(''))
    }
})

const fileFilter = (req,file,cb) => {
    const mimetypeFilter = 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png'

    if(mimetypeFilter){
        cb(null,true)
    }
    else{
        cb(null,false);
    }

}

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024 * 1024 * 5 //5mb
    },
    fileFilter:fileFilter
})


router.get('/',productsControllers.products_get_all)

router.post('/', checkAuth,upload.single('productImage'),productsControllers.products_create_product)


router.get('/:productId',productsControllers.products_get_product)

//PATCH => [{"propName":"price","value":"14"}]
router.patch('/:productId',checkAuth,productsControllers.products_edit_product)

router.delete('/:productId',checkAuth,productsControllers.products_delete_product)



module.exports = router;