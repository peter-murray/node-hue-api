import { HueError } from './HueError';
import { KeyValueType } from './commonTypes';
import { ApiError } from './ApiError';

const suppressDeprecationWarnings = process.env.NODE_HUE_API_SUPPRESS_DEPRICATION_WARNINGS || false;

type ResponsePayloads = KeyValueType | KeyValueType[]

/**
 * Parses a JSON response looking for the errors in the result(s) returned.
 * @param results The results to look for errors in.
 * @returns {Array} Of errors found.
 */
export function parseErrors(results: ResponsePayloads): HueError[] | undefined {
  let errors: HueError[] = [];

  if (Array.isArray(results)) {
    results.forEach(result => {
      if (!result.success) {
        const error = parseErrors(result);
        if (error) {
          errors = errors.concat(error);
        }
      }
    });
  } else {
    if (results.error) {
      // Due to the handling of remote and local errors, we need to differentiate description and message in the errors,
      // as the remote API uses both, whilst local uses only description. -- TODO need to review this
      if (results.error.description && !results.error.message) {
        const payload = Object.assign({message: results.error.description}, results.error);
        errors.push(new HueError(payload));
      } else {
        errors.push(new HueError(results.error));
      }
    }
  }
  return errors.length > 0 ? errors : undefined;
}


/**
 * Parses a JSON response checking for success on all changes.
 * @param result The JSON object to parse for success messages.
 * @returns true if all changes were successful.
 */
export function wasSuccessful(result: ResponsePayloads): boolean {
  let success = true,
    idx,
    len;

  if (Array.isArray(result)) {
    for (idx = 0, len = result.length; idx < len; idx++) {
      success = success && wasSuccessful(result[idx]);
    }
  } else {
    success = result.success !== undefined;
  }
  return success;
}


export function extractUpdatedAttributes(result: ResponsePayloads): KeyValueType {
  if (wasSuccessful(result)) {
    const values: KeyValueType = {};

    const updatedAttribute = function(update: KeyValueType) {
      const success = update.success;

      Object.keys(success).forEach(key => {
        const matched = /.*\/(.*)$/.exec(key);
        if (matched) {
          const attribute: string = matched[1];
          values[attribute] = true; //success[key];
        }
      });
    }

    if (result instanceof Array) {
      result.forEach(update => {
        updatedAttribute(update);
      });
    } else {
      updatedAttribute(result);
    }
    return values;
  } else {
    throw new ApiError('Error in response'); //TODO extract the error
  }
}

// //TODO the type system could replace this function now
// function asStringArray(value) {
//   if (!value) {
//     return null;
//   }
//
//   if (Array.isArray(value)) {
//     const result = [];
//
//     value.forEach(val => {
//       result.push(`${val}`);
//     });
//
//     return result;
//   } else {
//     return [`${value}`];
//   }
// }

// function getValueforKey(key, data) {
//   //Use dot notation to get nested values
//   const path = key.split('.');
//
//   let target = data
//     , value = null
//   ;
//
//   path.forEach(part => {
//     if (target != null) {
//       value = target[part];
//       target = value;
//     } else {
//       target = null;
//     }
//   });
//
//   return value;
// }

// function mergeArrays() {
//   // TODO this can be replaced with [[], [], ...].flat under Node.js 12+
//   let result = [];
//
//   Array.from(arguments).forEach(arg => {
//     if (arg) {
//       result = result.concat(arg);
//     }
//   });
//
//   return result;
// }

export function deprecatedFunction(version: string, func: string, message: string) {
  if (suppressDeprecationWarnings) {
    return;
  }

  console.log(`**************************************************************************************************`);
  console.log(`Deprecated Function Usage: ${func}\n`);
  console.log(`  ${message}\n`);
  console.log(`  Function will be removed from node-hue-api in version ${version}`);
  console.log(`**************************************************************************************************`);
}

