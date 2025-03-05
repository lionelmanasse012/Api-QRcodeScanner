import QrCode from '#models/qr_code'
import { HttpContext } from '@adonisjs/core/http'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'  // Importer uuid pour générer un identifiant unique

export default class QrCodesController {
    // Méthode pour vérifier le QR code
    public async verify({ request, response }: HttpContext) {
        const { serialNumber } = request.only(['serialNumber'])

        // Vérification que le numéro de QR Code est bien fourni
        if (!serialNumber) {
            return response.badRequest({ success: false, message: 'Numéro de QR Code manquant.' })
        }

        // Recherche du QR Code par son numéro de série
        const qrCode = await QrCode.findBy('qr_code_serial', serialNumber)

        // Si le QR Code n'existe pas
        if (!qrCode) {
            return response.notFound({ success: false, message: 'QR Code invalide ou inexistant.' })
        }

        // Retourner le statut du QR Code
        return response.ok({
            success: true,
            message: `Statut du QR Code : ${qrCode.status}.`,
            data: qrCode.toJSON()
        })
    }

    // Méthode pour générer un QR code et l'enregistrer dans la base de données
    public async generateQRCode({ request, response }: HttpContext) {
        const { nom, prenom, bon, carriere, ministre } = request.only(['nom', 'prenom', 'bon', 'carriere', 'ministre'])

        // Vérification que toutes les données sont bien fournies
        if (!nom || !prenom || !bon || !carriere || !ministre) {
            return response.badRequest({ success: false, message: 'Tous les champs sont requis.' })
        }

        const QRCodeSerial = this.generateSerialNumber()

        try {
            // Génération du QR Code en base64 avec les données
            const qrCodeData = `
        Nom: ${nom}
        Prénom: ${prenom}
        Bon: ${bon}
        Carrière: ${carriere}
        Ministre: ${ministre}
        QRCodeSerial: ${QRCodeSerial}
      `
            const qrCodeImage = await QRCode.toDataURL(qrCodeData)

            // Création d'une nouvelle instance de QR Code
            const newQrCode = new QrCode()
            newQrCode.nom = nom
            newQrCode.prenom = prenom
            newQrCode.bon = bon
            newQrCode.carriere = carriere
            newQrCode.ministre = ministre
            newQrCode.qrCodeSerial = QRCodeSerial
            newQrCode.qrCodeData = qrCodeImage  // Sauvegarder l'image base64 du QR Code
            newQrCode.status = 'pending'  // Définir le statut initial du QR Code
            await newQrCode.save()

            // Réponse avec les détails du QR Code généré
            return response.ok({
                success: true,
                message: 'QR Code généré et enregistré avec succès.',
                qrCodeSerial: newQrCode.qrCodeSerial,
                qrCodeImage
            })
        } catch (error) {
            // Log de l'erreur pour mieux comprendre la cause
            console.error('Erreur lors de la génération du QR Code:', error)
            return response.internalServerError({ success: false, message: 'Erreur lors de la génération du QR Code.' })
        }
    }

    // Méthode pour mettre à jour le statut du QR Code
    public async updateStatus({ request, response }: HttpContext) {
        const { serialNumber } = request.only(['serialNumber'])

        // Vérification que le numéro de QR Code est bien fourni
        if (!serialNumber) {
            return response.badRequest({ success: false, message: 'Numéro de QR Code manquant.' })
        }

        // Recherche du QR Code par son numéro de série
        const qrCode = await QrCode.findBy('qr_code_serial', serialNumber)

        // Si le QR Code n'existe pas
        if (!qrCode) {
            return response.notFound({ success: false, message: 'QR Code invalide ou inexistant.' })
        }

        // Vérification si le QR Code a déjà été payé
        if (qrCode.status === 'paid') {
            return response.badRequest({ success: false, message: 'QR Code déjà payé.' })
        }

        // Mise à jour du statut du QR Code
        qrCode.status = 'paid'
        await qrCode.save()

        return response.ok({ success: true, message: 'Statut mis à jour avec succès.' })
    }

    // Méthode pour générer un numéro de série unique avec UUID
    private generateSerialNumber(): string {
        return 'QR-' + uuidv4()  // Utilisation d'UUID pour garantir l'unicité du numéro de série
    }
}
