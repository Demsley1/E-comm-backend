const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

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

router.post('/', (req, res) => {
  // create a new tag
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

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
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

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
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
