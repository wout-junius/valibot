import type {
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';
import { type Class } from './instance.ts';

/**
 * Instance schema type.
 */
export type InstanceSchemaAsync<
  TClass extends Class,
  TOutput = InstanceType<TClass>
> = BaseSchemaAsync<InstanceType<TClass>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'instance';
  /**
   * The class of the instance.
   */
  class: TClass;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<InstanceType<TClass>> | undefined;
};

/**
 * Creates an async instance schema.
 *
 * @param class_ The class of the instance.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async instance schema.
 */
export function instanceAsync<TClass extends Class>(
  class_: TClass,
  pipe?: PipeAsync<InstanceType<TClass>>
): InstanceSchemaAsync<TClass>;

/**
 * Creates an async instance schema.
 *
 * @param class_ The class of the instance.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async instance schema.
 */
export function instanceAsync<TClass extends Class>(
  class_: TClass,
  message?: ErrorMessage,
  pipe?: PipeAsync<InstanceType<TClass>>
): InstanceSchemaAsync<TClass>;

export function instanceAsync<TClass extends Class>(
  class_: TClass,
  arg2?: PipeAsync<InstanceType<TClass>> | ErrorMessage,
  arg3?: PipeAsync<InstanceType<TClass>>
): InstanceSchemaAsync<TClass> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'instance',
    async: true,
    class: class_,
    message,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof this.class)) {
        return schemaIssue(info, 'type', 'instance', this.message, input);
      }

      // Execute pipe and return result
      return pipeResultAsync(input, this.pipe, info, 'instance');
    },
  };
}
