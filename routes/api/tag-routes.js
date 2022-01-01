const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// Get all tags /api/tags
router.get('/', (req, res) => {
  // be sure to include its associated Product data
  Tag.findAll({
    include: [
      {
        model: ProductTag,
        attributes: {exclude: ['product_id', 'tag_id'] },
        include: {
          model: Product,
          attributes: ['id', 'product_name', 'price', 'stock']
        }
      }
    ]
  }).then(tagData => res.json(tagData))
  .catch(err => {
    res.status(500).json(err);
  });
});

// Get specific tag /api/tags/1
router.get('/:id', (req, res) => {
  // be sure to include its associated Product data
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: ProductTag,
      attributes: { exclude: ['product_id', 'tag_id'] },
      include: {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    }
  }).then(tagData => {
    if(!tagData){
      res.status(404).json({ message: 'No tags found with this id' });
      return;
    }
    res.json(tagData);
  }).catch(err => {
    res.status(500).json(err);
  });
});

// Create new tag /api/tags
router.post('/', (req, res) => {
  //expets { "tag_name": "green"}
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then(tagBody => res.json(tagBody))
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  });
});

// Update a specific tag /api/tags/1
router.put('/:id', (req, res) => {
  // expects { "tag_name": "clothe" }
  Tag.update(req.body,{
    where: {
      id: req.params.id
    }
  }).then(tagBody => {
    if(!tagBody){
      res.status(404).json({ message: 'No tag found with this id to be able to update'})
      return;
    }
    res.json(tagBody)
  }).catch(err => {
    res.status(500).json(err);
  });
});

// Delete a specific tag /api/tags/1
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  }).then(tagData => {
    if(!tagData){
      res.status(404).json({ message: 'Unable to locate tag with this id' });
      return;
    }
    res.json(tagData)
  }).catch(err => {
    res.status(500).json(err);
  });
});

module.exports = router;
