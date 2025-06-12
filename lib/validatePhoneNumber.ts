import { isValidPhoneNumber } from 'libphonenumber-js'
import { CustomHelpers } from 'joi'

export function validatePhoneNumber(value: string, helpers: CustomHelpers) {
  if (!isValidPhoneNumber(value)) {
    return helpers.error("string.invalidPhone");
  }
  return value;
}
