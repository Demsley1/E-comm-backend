const router = require('express').Router();
const { rsort } = require('semver');
const { Product, Category, Tag, ProductTag } = require('../../models');

// get all products /api/products
router.get('/', (req, res) => {
  // be sure to include its associated Category and Tag data
  Product.findAll({
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [
      {
        model: Category,
        attributes:['category_name']
      },
      {
        model: ProductTag,
        attributes: { exclude: ['tag_id', 'product_id'] },
        include: {
          model: Tag,
          attributes: ['id', 'tag_name']
        }
      }
    ]
  }).then(productData => res.json(productData))
  .catch(err => {
    res.status(500).json(err);
  })
});

// get one product /api/products/1
router.get('/:id', (req, res) => {
  // be sure to include its associated Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: ProductTag,
        attributes: { exclude: ['tag_id', 'product_id'] },
        include: {
          model: Tag,
          attributes: ['id', 'tag_name']
        }
      }
    ]
  }).then(productData => {
    if(!productData){
      res.status(404).json({ message: 'Found no product with this id'});
      return;
    }
    res.json(productData);
  }).catch(err => {
    res.status(500).json(err)
  });
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    tagIds: [req.body.tagIds]
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// update product /api/products/6
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// Delete /api/products/1
router.delete('/:id', (req, res) => {
  // {foreign key constraint doesnt work}
  // delete one product by its `id` value
  Product.destroy({
    attributes: { exclude: ['tagIds'] },
    where: {
      id: req.params.id
    }
  }).then(productData => {
    if(!productData){
      res.status(404).json({ message: 'There is no product found at this id '});
      return;
    }
    res.json(productData)
  }).catch(err => {
    res.status(500).json(err);
  })
});

module.exports = router;
