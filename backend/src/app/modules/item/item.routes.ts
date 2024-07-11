import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ItemController } from './item.controller';
import { ItemValidation } from './item.validation';

const router = express.Router();

router.post(
  '/create',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ItemValidation.createItemZodSchema),
  ItemController.createItem
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN), ItemController.getAllItems);
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), ItemController.getAItem);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ItemValidation.updateItemZodSchema),
  ItemController.updateItem
);
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), ItemController.deleteItem);

export const ItemRoutes = router;
