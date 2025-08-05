import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import * as z from 'zod';

export function useZodForm<T extends z.ZodObject<any, any>>(schema: T) {
  type FormType = z.infer<T>;
  
  const validationSchema = toTypedSchema(schema);
  
  const { handleSubmit, errors, resetForm, meta } = useForm({
    validationSchema,
    validateOnMount: false
  });
  
  const createField = <K extends keyof FormType>(name: K) => {
    const { value, errorMessage } = useField(name as string);
    
    return {
      value,
      errorMessage,
      hasError: computed(() => !!errorMessage.value)
    };
  };
  
  return {
    handleSubmit,
    errors,
    resetForm,
    createField,
    isSubmitting: meta.value.pending,
    isValid: meta.value.valid
  };
}
