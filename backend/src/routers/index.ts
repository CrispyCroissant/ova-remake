import { Router } from 'express';
import fareController from '../controllers/fareController';
import orderController from '../controllers/orderController';
import paymentController from '../controllers/paymentController';

const router: Router = Router();

router.post('/fare', fareController.getFare);

router.post('/order', orderController.saveOrder);
router.delete('/order', orderController.deleteOrder);

router.post('/start-payment', paymentController.createIntent);
router.post('/stripe-webhook', paymentController.processPayment);

export default router;
