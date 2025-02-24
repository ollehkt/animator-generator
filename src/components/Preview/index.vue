<script setup>
import { ref, onMounted } from 'vue'
import { useObjectStore } from '@/store'
import { storeToRefs } from 'pinia'

const objectStore = useObjectStore()
// const { objects } = storeToRefs(objectStore)
const objects = ref([
  {
    objectData: {
      uuid: 'svg-da3k1nk5ljk2l4-34nkl1j3-123',
      objectType: 'image',
      diagramType: null,
      url: 'https://questbook-prod-bucket.s3.ap-northeast-2.amazonaws.com/user/1/Questbook_test_2024-12-17-14-09-497.png',
      text: '',
      points: { x: 10, y: 10 },
      style: {
        background: '#825feb',
        opacity: 100,
        color: '#825feb',
      },
      size: {
        width: 140,
        height: 100,
      },
    },
    animationData: [
      {
        triggerType: 'click',
        animation: [
          {
            triggerTarget: 'svg-da3k1nk5ljk2l4-34nkl1j3-123',
            actionType: 'move',
            points: [
              { x: 200, y: 200 },
              { x: 300, y: 300 },
            ],
            ease: 'linear',
            duration: 0.9,
            delay: 0,
            count: null,
            direction: 'normal',
            fillMode: null,
            actionSetting: {
              moveType: 'line',
              curviness: 0,
            },
          },
        ],
        isSimultaneousness: true,
        callbackFunction: null,
      },
    ],
  },
])
const svgRef = ref(null)

const handleTrigger = (objectId, triggerType) => {
  const targetObject = objects.value.find((obj) => obj.objectData.uuid === objectId)
  if (!targetObject) return

  // animationData에서 해당 트리거 타입에 맞는 애니메이션 찾기
  const matchingAnimations = targetObject.animationData.find(
    (data) => data.triggerType === triggerType
  )

  if (!matchingAnimations) return

  // 동시 실행 여부 확인
  if (matchingAnimations.isSimultaneousness) {
    // 모든 애니메이션 동시 실행
    matchingAnimations.animation.forEach((anim) => {
      executeAnimation(anim.triggerTarget || objectId, anim)
    })
  } else {
    // 순차적으로 실행
    matchingAnimations.animation.forEach((anim, index) => {
      setTimeout(() => {
        executeAnimation(anim.triggerTarget || objectId, anim)
      }, (anim.delay || 0) * 1000 + index * 100)
    })
  }

  // 콜백 함수 실행
  if (matchingAnimations.callbackFunction) {
    window[matchingAnimations.callbackFunction]?.()
  }
}

const getPointX = (points) => {
  if (!points) return 0
  // 배열인 경우 첫 번째 점의 x 좌표 사용
  if (Array.isArray(points)) return points[0]?.x || 0
  // 객체인 경우 x 좌표 사용
  return points.x || 0
}

const getPointY = (points) => {
  if (!points) return 0
  // 배열인 경우 첫 번째 점의 y 좌표 사용
  if (Array.isArray(points)) return points[0]?.y || 0
  // 객체인 경우 y 좌표 사용
  return points.y || 0
}

const executeAnimation = (objectId, animation) => {
  const element = document.getElementById(objectId)
  if (!element) {
    console.log('Element not found:', objectId)
    return
  }

  // 애니메이션을 실행할 객체의 objectData 찾기
  const targetObject = objects.value.find((obj) => obj.objectData.uuid === objectId)
  if (!targetObject) return

  const bbox = element.getBBox()
  const centerX = bbox.x + bbox.width / 2
  const centerY = bbox.y + bbox.height / 2

  const animationConfig = {
    duration: (animation.duration || 1) * 1000,
    easing: animation.ease || 'linear',
    fill: animation.fillMode || 'forwards',
    delay: (animation.delay || 0) * 1000,
    iterations: animation.count || 1,
    direction: animation.direction || 'normal',
  }

  switch (animation.actionType) {
    case 'move': {
      const moveTargetId = animation.triggerTarget || objectId
      const moveTargetElement = document.getElementById(moveTargetId)
      const moveTargetObject = objects.value.find((obj) => obj.objectData.uuid === moveTargetId)

      if (!moveTargetElement || !moveTargetObject) return

      const animPoints = animation.points
      if (!animPoints || !Array.isArray(animPoints)) return

      // 객체 타입에 따라 적절한 요소 선택
      const targetElement = moveTargetElement.querySelector('image, text, ellipse')
      if (!targetElement) return

      let targetPoint
      if (animPoints.length === 1) {
        targetPoint = animPoints[0]
      } else if (animPoints.length === 2) {
        targetPoint = animPoints[1]
        moveTargetObject.objectData.points = { ...animPoints[0] }
        updateElementPosition(targetElement, moveTargetObject.objectData)
      }

      const currentPoint =
        animPoints.length === 2 ? animPoints[0] : moveTargetObject.objectData.points
      const deltaX = targetPoint.x - currentPoint.x
      const deltaY = targetPoint.y - currentPoint.y

      moveTargetElement.animate(
        [{ transform: 'translate(0, 0)' }, { transform: `translate(${deltaX}px, ${deltaY}px)` }],
        animationConfig
      )

      break
    }

    case 'scale':
      const scale = animation.actionSetting.scaleMagnification
      element.animate(
        [
          { transformOrigin: `${centerX}px ${centerY}px` },
          { transformOrigin: `${centerX}px ${centerY}px`, transform: `scale(${scale})` },
        ],
        animationConfig
      )
      break

    case 'rotate':
      element.animate(
        [
          { transformOrigin: `${centerX}px ${centerY}px` },
          {
            transform: `rotate(${animation.actionSetting.degree}deg)`,
            transformOrigin: `${centerX}px ${centerY}px`,
          },
        ],
        animationConfig
      )
      break

    case 'opacity':
      element.animate(
        [{ opacity: 1 }, { opacity: animation.actionSetting.opacity / 100 }],
        animationConfig
      )
      break

    case 'color':
      const colorTargetId = animation.triggerTarget || objectId
      const colorTargetElement = document.getElementById(colorTargetId)
      if (!colorTargetElement) return

      const colorCircleElement = colorTargetElement.querySelector('circle')
      if (!colorCircleElement) return
      colorCircleElement.animate(
        [
          { fill: colorCircleElement.getAttribute('fill') },
          { fill: animation.actionSetting.color },
        ],
        animationConfig
      )
      break

    case 'size':
      const targetId = animation.triggerTarget || objectId
      const targetElement = document.getElementById(targetId)
      if (!targetElement) return

      // objectType 찾기
      const targetObject = objects.value.find((obj) => obj.objectData.uuid === targetId)
      if (!targetObject) return

      const objectType = targetObject.objectData.objectType
      const element = targetElement.querySelector('image, ellipse, text')
      if (!element) return

      // 현재 크기와 새로운 크기 가져오기
      const newWidth = animation.actionSetting.width
      const newHeight = animation.actionSetting.height
      let currentWidth, currentHeight

      switch (objectType) {
        case 'image':
          currentWidth = parseFloat(element.getAttribute('width'))
          currentHeight = parseFloat(element.getAttribute('height'))
          break
        case 'diagram':
          currentWidth = parseFloat(element.getAttribute('rx')) * 2
          currentHeight = parseFloat(element.getAttribute('ry')) * 2
          break
        case 'text':
          const bbox = element.getBBox()
          currentWidth = bbox.width
          currentHeight = bbox.height
          break
      }

      // 크기 변경 애니메이션
      element.animate(
        [
          {
            transform: 'scale(1)',
            transformOrigin: 'center center',
          },
          {
            transform: `scale(${newWidth / currentWidth}, ${newHeight / currentHeight})`,
            transformOrigin: 'center center',
          },
        ],
        animationConfig
      )

      // 애니메이션 완료 후 실제 속성 업데이트
      setTimeout(() => {
        const deltaWidth = newWidth - currentWidth
        const deltaHeight = newHeight - currentHeight

        switch (objectType) {
          case 'image':
            const currentX = parseFloat(element.getAttribute('x'))
            const currentY = parseFloat(element.getAttribute('y'))
            element.setAttribute('width', newWidth)
            element.setAttribute('height', newHeight)
            element.setAttribute('x', currentX - deltaWidth / 2)
            element.setAttribute('y', currentY - deltaHeight / 2)
            break
          case 'diagram':
            element.setAttribute('rx', newWidth / 2)
            element.setAttribute('ry', newHeight / 2)
            break
          case 'text':
            // 텍스트의 경우 크기는 font-size로 조절됨
            const currentSize = window.getComputedStyle(element).fontSize
            const newSize = (parseFloat(currentSize) * newWidth) / currentWidth + 'px'
            element.style.fontSize = newSize
            break
        }
      }, animationConfig.duration + animationConfig.delay)
      break

    case 'display':
      if (animation.actionSetting.isHidden) {
        element.style.display = 'none'
      } else {
        element.style.display = 'block'
      }
      break

    case 'open':
      if (animation.actionSetting.url) {
        window.open(
          animation.actionSetting.url,
          animation.actionSetting.isBlank ? '_blank' : '_self'
        )
      }
      break
  }
}

// 키보드 이벤트 처리를 위한 새로운 메서드
const handleKeyEvent = (event, eventType) => {
  objects.value.forEach((object) => {
    const matchingAnimation = object.animationData.find((data) => {
      if (eventType === 'keyup' && data.triggerType === 'keyup') {
        return data.keyCode === event.key
      }
      return data.triggerType === eventType
    })

    if (matchingAnimation) {
      handleTrigger(object.objectData.uuid, eventType)
    }
  })
}

// 이미지 위치 업데이트 헬퍼 함수
const updateElementPosition = (element, objectData) => {
  const { points, size, objectType } = objectData

  switch (objectType) {
    case 'image':
      element.setAttribute('x', points.x - size.width / 2)
      element.setAttribute('y', points.y - size.height / 2)
      break

    case 'text':
      // text는 중앙 정렬을 위해 text-anchor="middle" 속성이 필요
      element.setAttribute('x', points.x)
      element.setAttribute('y', points.y)
      element.setAttribute('text-anchor', 'middle')
      element.setAttribute('dominant-baseline', 'middle')
      break

    case 'diagram':
      if (element.tagName.toLowerCase() === 'ellipse') {
        element.setAttribute('cx', points.x)
        element.setAttribute('cy', points.y)
      }
      break
  }
}
</script>

<template>
  <div class="flex items-center justify-center w-full h-screen bg-white">
    <svg ref="svgRef" :width="720" :height="452" class="bg-white border border-black outline-none">
      <g v-for="object in objects" :key="object.objectData.uuid" :id="object.objectData.uuid">
        <!-- Circle -->
        <ellipse
          class="outline-none"
          v-if="
            object.objectData.objectType === 'diagram' && object.objectData.diagramType === 'circle'
          "
          :cx="object.objectData.points.x"
          :cy="object.objectData.points.y"
          :rx="object.objectData.radiusX || object.objectData.size.width / 2"
          :ry="object.objectData.radiusY || object.objectData.size.height / 2"
          :fill="object.objectData.style.background"
          @click="handleTrigger(object.objectData.uuid, 'click')"
        />

        <!-- Image -->
        <image
          v-if="object.objectData.objectType === 'image'"
          :x="object.objectData.points.x - object.objectData.size.width / 2"
          :y="object.objectData.points.y - object.objectData.size.height / 2"
          :width="object.objectData.size.width"
          :height="object.objectData.size.height"
          :href="object.objectData.url"
          preserveAspectRatio="xMidYMid meet"
          @click="handleTrigger(object.objectData.uuid, 'click')"
          @dblclick="handleTrigger(object.objectData.uuid, 'dblclick')"
          @mouseenter="handleTrigger(object.objectData.uuid, 'mouseover')"
          @mouseleave="handleTrigger(object.objectData.uuid, 'mouseleave')"
          @mouseup="handleTrigger(object.objectData.uuid, 'mouse-up')"
          @mousedown="handleTrigger(object.objectData.uuid, 'mousedown')"
          @focus="handleTrigger(object.objectData.uuid, 'focus')"
          @blur="handleTrigger(object.objectData.uuid, 'blur')"
          tabindex="0"
        />

        <!-- Text -->
        <text
          v-if="object.objectData.objectType === 'text'"
          :x="object.objectData.points.x"
          :y="object.objectData.points.y"
          :fill="object.objectData.style.color || '#000'"
          @click="handleTrigger(object.objectData.uuid, 'click')"
          @dblclick="handleTrigger(object.objectData.uuid, 'dblclick')"
          @mouseenter="handleTrigger(object.objectData.uuid, 'mouseover')"
          @mouseleave="handleTrigger(object.objectData.uuid, 'mouseleave')"
          @mouseup="handleTrigger(object.objectData.uuid, 'mouse-up')"
          @mousedown="handleTrigger(object.objectData.uuid, 'mousedown')"
          @focus="handleTrigger(object.objectData.uuid, 'focus')"
          @blur="handleTrigger(object.objectData.uuid, 'blur')"
          tabindex="0"
        >
          {{ object.objectData.text }}
        </text>
      </g>
    </svg>
  </div>
</template>
