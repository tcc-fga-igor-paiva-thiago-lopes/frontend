import { toastController } from '@ionic/vue';

export const presentToast = async (
    message: string,
    color: string,
    position: 'top' | 'bottom' | 'middle' | undefined = 'top'
) => {
    const toast = await toastController.create({
        message,
        position,
        color,
        duration: 1500,
    });

    await toast.present();
};
