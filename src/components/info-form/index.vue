<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-row>
      <template v-for="item in formFields" :key="item.name">
        <a-col
          :span="item.span"
          v-if="typeof item.ifRender === 'function' ? item.ifRender() : item.ifRender"
        >
          <a-form-item :ref="item.name" :label="item.label" :name="item.name">
            <component
              :is="`a-${item.type}`"
              v-model:value="formState[item.name]"
              v-bind="item.attrs || {}"
              :disabled="item.disabled"
              :placeholder="item.placeholder || item.label"
            ></component>
          </a-form-item>
        </a-col>
      </template>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import type { FormFields, FormState } from './type'
import type { Rule } from 'ant-design-vue/es/form'
import { computed } from 'vue'

interface Props {
  formFields: FormFields[]
  modelValue: FormState
  labelCol?: { span: number; offset?: number }
  wrapperCol?: { span: number; offset?: number }
}

const props = withDefaults(defineProps<Props>(), {
  labelCol: () => ({ span: 6 }),
  wrapperCol: () => ({ span: 18 })
})

const formFields = computed(() => {
  return props.formFields.map((a) => {
    return {
      ...a,
      span: a.span ?? 8,
      ifRender: a.ifRender ?? true
    }
  })
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormState): void
}>()

// 计算属性用于双向绑定
const formState = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const rules: Record<string, Rule[]> = {}
</script>

<style scoped lang="less"></style>
