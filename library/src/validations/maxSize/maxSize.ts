import type { BaseValidation, ErrorMessage } from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';

/**
 * Max size validation type.
 */
export type MaxSizeValidation<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'max_size';
  /**
   * The maximum size.
   */
  requirement: TRequirement;
};

/**
 * Creates a validation function that validates the size of a map, set or blob.
 *
 * @param requirement The maximum size.
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function maxSize<
  TInput extends Map<any, any> | Set<any> | Blob,
  TRequirement extends number
>(
  requirement: TRequirement,
  message: ErrorMessage = 'Invalid size'
): MaxSizeValidation<TInput, TRequirement> {
  return {
    type: 'max_size',
    async: false,
    message,
    requirement,
    _parse(input) {
      return input.size > this.requirement
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}
