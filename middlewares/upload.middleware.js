const multer = require('multer')
const path = require('path')

// storage engine

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null, 'upload') // stores in upload folder
    },

    filename : (req, file,cb)=> {
        cb(null, Date.now() + path.extname(file.originalname)) // original name
    }
})

const upload = multer({storage :  storage})

module.exports = upload