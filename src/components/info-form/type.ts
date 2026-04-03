export interface FormFields {
  label: string
  type: string
  name: string
  disabled?: boolean
  span?: number
  ifRender?: boolean | (() => boolean)
  placeholder?: string
  attrs?: object
}

export interface FormState {
  [key: string]: string | number | boolean | any[]
}

