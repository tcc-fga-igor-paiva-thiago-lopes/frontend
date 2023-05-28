import { IonicSafeString, alertController } from '@ionic/vue';

interface IAlertOptions {
    title: string;
    message: string | IonicSafeString;
    cancelText?: string;
    confirmText?: string;
    cssClass?: string | string[];
    cancelClass?: string | string[];
    confirmClass?: string | string[];
    cancelAction?: () => void;
    confirmAction: () => void;
}

export const presentConfirmationAlert = async ({
    title,
    message,
    cancelAction,
    confirmAction,
    cancelClass,
    confirmClass,
    cssClass,
    cancelText = 'Cancelar',
    confirmText = 'OK',
}: IAlertOptions) => {
    const alert = await alertController.create({
        header: title,
        message,
        cssClass,
        buttons: [
            {
                text: cancelText,
                role: 'cancel',
                cssClass: cancelClass,
                handler: cancelAction,
            },
            {
                text: confirmText,
                role: 'confirm',
                // role: 'destructive',
                cssClass: confirmClass,
                handler: confirmAction,
            },
        ],
    });

    await alert.present();

    return alert;
};
