export const TRIGGER_CONFIG = {
  triggers: {
    label: '트리거',
    value:[
      {label: '클릭', value: 'click'},
      {label: '더블클릭', value: 'doubleClick'},
      {label: '마우스 다운', value: 'mouseDown'},
      {label: '마우스 업', value: 'mouseUp'},
    ]
  },
  targetObjects: {
    label: '트리거 타겟 객체',
    value: [],
  },
  actions: {
    label: '액션',
    value: {
      type: '', // 'move', 'url', 'opacity', 'scale'
      params: {
        // For move
        x: 0,
        y: 0,
        // For url
        url: '',
        // For opacity
        opacity: 1,
        // For scale
        scale: 1,
      },
    },
  },
  actionTarget: {
    label: '액션 타겟',
    value: '',
  },
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

