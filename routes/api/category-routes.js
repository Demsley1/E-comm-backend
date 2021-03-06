const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET all categories /api/categories 
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

// GET a single category /api/categories/1
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

// POST a new category /api/categories
router.post('/', (req, res) => {
  // expects {"category_name": "bikes"}
  Category.create({
    category_name: req.body.category_name
  }).then(categoryBody => res.json(categoryBody))
  .catch(err => {
    res.status(500).json(err);
  })
});

// PUT update a specific category /api/categories/1
router.put('/:id', (req, res) => {
  // expects {"category_name": "furniture"}
  Category.update(req.body, {
    where: { 
      id: req.params.id
    }
  }).then(categoryBody => {
    if(!categoryBody[0]){
      res.status(404).json({ message: 'No category to update at this id' })
      return;
    }
    res.json(categoryBody)
  }).catch(err => {
    res.status(500).json(err) 
  });
});

// DELETE a specific catgory /api/categories/1
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  }).then(categoryData => {
    if(!categoryData){
      res.status(404).json({ message: "No category found with this id" })
      return;
    }
    res.json(categoryData)
  }).catch(err => {
    res.status(500).json(err);
  });
});

module.exports = router;
