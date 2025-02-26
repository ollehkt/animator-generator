import { createPinia } from 'pinia'
import { useObjectStore } from './objectStore'
import { useControllerStore } from './controller.store'
import { usePreviewStore } from './preview.store'
import { useAnimationStore } from './animation.store'
import { useViewportStore } from './viewport.store'
import { useProjectsStore } from './project.store'
import { useDataStore } from './data.store'
const pinia = createPinia()

export { 
  pinia, 
  useObjectStore, 
  useControllerStore, 
  usePreviewStore, 
  useAnimationStore, 
  useViewportStore, 
  useProjectsStore,
  useDataStore
}
