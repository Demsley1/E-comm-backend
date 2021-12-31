const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET /api/categories 
router.get('/', (req, res) => {
  Category.findAll({
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ]
  }).then(categoryData => res.json(categoryData))
  .catch(err => {
    if(err){
      console.log(err)
      res.status(500).json({ message: 'Sorry unable to reach the database at this time' });
      return;
    }
  })
});

// GET /api/categories/1
router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock']
    }
  }).then(categoryData => {
    if(!categoryData){
      res.status(404).json({ message: 'There is no category with this id' });
      return;
    }
    res.json(categoryData)
  }).catch(err => {
      res.status(500).json(err);
    });
});

// POST /api/categories
router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
