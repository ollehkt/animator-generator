import { createPinia } from 'pinia'
import { useObjectStore } from './objectStore'
import { useControllerStore } from './controller.store'
import { usePreviewStore } from './preview.store'
import { useAnimationStore } from './animation.store'
import { useProjectsStore } from './project.store'
import { useViewportStore } from './viewport.store'
const pinia = createPinia()

export {
  pinia,
  useObjectStore,
  useControllerStore,
  usePreviewStore,
  useAnimationStore,
  useViewportStore,
  useProjectsStore,
}
