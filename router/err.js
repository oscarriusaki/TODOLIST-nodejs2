const { Router } = require('express');

const router = Router();

router.get('*', (req, res) => {
    res.sendFile(__dirname.substring(0, __dirname.search('router')) +'/public/404.html')
});
router.put('*', (req, res) =>{

})
router.post('*', (req, res) => {

})
router.delete('*', () =>{

})

module.exports = router;
