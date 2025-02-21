import { createPinia } from 'pinia'
import { useObjectStore } from './objectStore'
import { useControllerStore } from './controllerStore'
import { usePreviewStore } from './preview.store'
import { useAnimationStore } from './animationStore'
const pinia = createPinia()

export { pinia, useObjectStore, useControllerStore, usePreviewStore, useAnimationStore }
