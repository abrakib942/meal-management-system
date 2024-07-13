import express from 'express';
import { OrderController } from './order.controller';

const router = express.Router();

router.post('/create', OrderController.makeOrder);

router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getAOrder);

router.patch('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

export const OrderRoutes = router;
