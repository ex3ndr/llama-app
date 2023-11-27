import { Asset } from 'expo-asset';
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

export async function loadLibs() {
    const [{ localUri }] = await Asset.loadAsync(require('../assets/canvaskit.wasm'));
    await LoadSkiaWeb({
        locateFile(file) {
            if (file === 'canvaskit.wasm') {
                return localUri!;
            } else {
                throw Error('Unexpected file');
            }
        },
    });
}