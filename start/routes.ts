/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import QrCodesController from '#controllers/qr_codes_controller'
import router from '@adonisjs/core/services/router'

router.post('/verify-qr', [QrCodesController, 'verify'])
router.post('/generate-qr', [QrCodesController, 'generateQRCode'])
router.post('/update-status', [QrCodesController, 'updateStatus'])