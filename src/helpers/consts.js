// OBJECT TOOL BAR 
export const OBJECT_TYPE = [
  {
    id: 1,
    name: '도형',
    type: 'shape',
  },
  {
    id: 2,
    name: '이미지',
    type: 'image',
  },
  {
    id: 3,
    name: '텍스트',
    type: 'text',
  },
]

export const ALIGN_ICONS = {
  left: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M2 8H8M2 12H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  center: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M4 8H12M3 12H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  right: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14M8 8H14M5 12H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  top: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="5" y="1" width="6" height="10" stroke="currentColor" stroke-width="1.5" rx="1"/>
  </svg>`,
  middle: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="5" y="3" width="6" height="10" stroke="currentColor" stroke-width="1.5" rx="1"/>
  </svg>`,
  bottom: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 12H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="5" y="5" width="6" height="10" stroke="currentColor" stroke-width="1.5" rx="1"/>
  </svg>`
}

export const OBJECT_ALIGN = [
  {
    id: 1,
    name: 'Left',
    type: 'left',
    icon: ALIGN_ICONS.left
  },
  {
    id: 2,
    name: 'Center',
    type: 'center',
    icon: ALIGN_ICONS.center
  },
  {
    id: 3,
    name: 'Right',
    type: 'right',
    icon: ALIGN_ICONS.right
  },
  {
    id: 4,
    name: 'Top',
    type: 'top',
    icon: ALIGN_ICONS.top
  },
  {
    id: 5,
    name: 'Middle',
    type: 'middle',
    icon: ALIGN_ICONS.middle
  },
  {
    id: 6,
    name: 'Bottom',
    type: 'bottom',
    icon: ALIGN_ICONS.bottom
  }
]

export const TRIGGER_CONFIG = {
  triggers: {
    label: '트리거',
    value:[
      {label: '클릭', value: 'click'},
      {label: '더블클릭', value: 'doubleClick'},
      {label: '마우스 안으로', value: 'mouseOver'},
      {label: '마우스 밖으로', value: 'mouseOut'},
      {label: '누르고 있기', value: 'mouseDown'},
      {label: '떼기', value: 'mouseUp'},
    ]
  },
  targetObjects: {
    label: '트리거 타겟 객체',
    value: [],
  },

  actions: {
    label: '액션',
    value:{
      objectActions: {
        label: '오브젝트액션',
        value:[
          {label: '이동', value: 'translate'},
          {label: '회전', value: 'rotate'},
          { label: '확대/축소', value: 'scale' },
          { label: '투명도', value: 'opacity' },
        ],
      },
      pageActions: {
        label: '페이지액션',
        value: [
          { label: 'URL로 이동', value: 'url' },
          { label: '페이지로 이동', value: 'forward' },
          { label: '전페이지로 이동', value: 'back' },
        ],
      },
      mediaActions: {
        label: '미디어액션',
        value: [
          { label: '재생', value: 'play' },
          { label: '일시정지', value: 'pause' },
          { label: '음소거', value: 'mute' },
          { label: '볼륨 조절', value: 'volume' },
        ],
      },
    },
  }
}

export const ANIMATION_TYPE = [
  {
    id: 1,
    name: '이동',
    type: 'translate',
  },
  {
    id: 2,
    name: '회전',
    type: 'rotate',
  },
  {
    id: 3,
    name: '확대/축소',
    type: 'scale',
  },
  {
    id: 4,
    name: '투명도',
    type: 'opacity',
  },
]

export const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
]

