import { alertController } from '@ionic/vue';

interface IAlertOptions {
    title: string;
    message: string;
    cancelText?: string;
    confirmText?: string;
    cancelClass?: string;
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
    cancelText = 'Cancelar',
    confirmText = 'OK',
}: IAlertOptions) => {
    const alert = await alertController.create({
        header: title,
        message,
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
