import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useDNDStore = defineStore('dnd', () => {
  // DragAndDrop
  const dndState = reactive({
    dragStartIndex: null,
    dragTargetIndex: null,
    isDraggable: false,
    dragover: false,
    dragStartSide: null,
  })

  const onMouseDown = (e) => {
    let element = e.target
    let isDraggableElement = false

    while (element !== null) {
      if (element.classList.contains('handler')) {
        isDraggableElement = true
        break
      }
      element = element.parentElement
    }

    dndState.isDraggable = isDraggableElement
    dndState.dragTargetIndex = null
  }

  const onDragEnter = (e, targetIndex, side) => {
    if (dndState.dragTargetIndex != targetIndex) {
      dndState.dragTargetIndex = targetIndex
    }

    dndState.dragover = side === null
  }

  const onDrop = (e, targetIndex, side, ai) => {
    updateItemOrder(targetIndex, side)
    dndState.dragStartIndex = null
    dndState.dragTargetIndex = null
    dndState.isDraggable = false
  }

  const updateItemOrder = (targetIndex, side) => {
    alert('updateItemOrder')
    return true


    // const sideArray = selectedElements[side]
    // const item = sideArray.splice(dndState.dragStartIndex, 1)[0]
    // sideArray.splice(targetIndex, 0, item)

    // dialogueStore.selectedElements[side] = sideArray


    // Object.keys(cardList).forEach((cardKey) => {
    //   const sideArray = cardList[cardKey][side]
    //   const item = sideArray.splice(dndState.dragStartIndex, 1)[0]
    //   sideArray.splice(targetIndex, 0, item)
    // })
  }

  return {
    dndState,
    onMouseDown,
    onDragEnter,
    onDrop,
    updateItemOrder,
  }
})
