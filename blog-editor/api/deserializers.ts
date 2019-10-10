
    import { IBlogPost, IBlogPostRequest } from '../common/types';


    
    const isObject = (value: unknown): value is {} => {
  const type = typeof value;
  return type === "function" || (type === "object" && !!value);
};

type Result<T> = ISuccessResult<T> | IErrorResult;

interface ISuccessResult<T> {
  success: true;
  value: T;
}

interface IErrorResult {
  success: false;
  error: IPropertyError;
}

interface IPropertyError {
  key: string;
  message: string;
  errors?: IPropertyError[];
}

const success = <T>(value: T): ISuccessResult<T> => ({
  success: true,
  value
});

const error = (
  key: string,
  message: string,
  errors?: IPropertyError[]
): IErrorResult => ({
  success: false,
  error: {
    key,
    message,
    errors
  }
});

const hasKey = <O extends {}, K extends string>(
  value: O,
  key: K
): value is O & Record<K, unknown> => key in value;

const assertKeyValue = <O extends {}, K extends string, T>(
  value: O,
  key: K,
  assertFn: (val: unknown) => Result<T>
): Result<O & Record<K, T>> => {
  if (hasKey(value, key)) {
    const result = assertFn(value[key]);
    if (result.success) {
      // at this point, we should have merged assertions here, but that doesn't
      // seem to be happening, hence the cast
      return success((value as unknown) as O & Record<K, T>);
    } else {
      return result;
    }
  } else {
    return error(key, `Expected object to have key '${key}'`);
  }
};

const isString = (value: unknown): value is string =>
  typeof value === "string";

const assertString = (key: string, value: unknown): Result<string> =>
  isString(value)
    ? success(value)
    : error(key, `Expected ${key} to be a string`);

const isNumber = (value: unknown): value is number =>
  typeof value === "number";

const assertNumber = (key: string, value: unknown): Result<number> =>
  isNumber(value)
    ? success(value)
    : error(key, `Expected ${key} to be a number`);
  

    
    
        const references = {
          '2': (value: unknown) => {
            return (() => {
      if (isObject(value)) {
        
                const _ts1_0 = assertKeyValue(value, 'slug', _ts2_v => assertString('slug', _ts2_v));
                if (!_ts1_0.success) { return _ts1_0; }
              

                const _ts1_1 = assertKeyValue(_ts1_0.value, 'title', _ts3_v => assertString('title', _ts3_v));
                if (!_ts1_1.success) { return _ts1_1; }
              

                const _ts1_2 = assertKeyValue(_ts1_1.value, 'description', _ts4_v => assertString('description', _ts4_v));
                if (!_ts1_2.success) { return _ts1_2; }
              

                const _ts1_3 = assertKeyValue(_ts1_2.value, 'dateCreated', _ts5_v => assertNumber('dateCreated', _ts5_v));
                if (!_ts1_3.success) { return _ts1_3; }
              

                const _ts1_4 = assertKeyValue(_ts1_3.value, 'dateModified', _ts6_v => assertNumber('dateModified', _ts6_v));
                if (!_ts1_4.success) { return _ts1_4; }
              

                const _ts1_5 = assertKeyValue(_ts1_4.value, 'content', _ts7_v => assertString('content', _ts7_v));
                if (!_ts1_5.success) { return _ts1_5; }
              

          return _ts1_5;
      } else {
        return error('IBlogPost', 'Expected to be object type');
      }
    })()
          }
        };
      

    const deserializers = {
      
            'IBlogPost': (value: unknown): Result<IBlogPost> => {
            return (() => {
      if (isObject(value)) {
        
                const _ts8_0 = assertKeyValue(value, 'slug', _ts9_v => assertString('slug', _ts9_v));
                if (!_ts8_0.success) { return _ts8_0; }
              

                const _ts8_1 = assertKeyValue(_ts8_0.value, 'title', _ts10_v => assertString('title', _ts10_v));
                if (!_ts8_1.success) { return _ts8_1; }
              

                const _ts8_2 = assertKeyValue(_ts8_1.value, 'description', _ts11_v => assertString('description', _ts11_v));
                if (!_ts8_2.success) { return _ts8_2; }
              

                const _ts8_3 = assertKeyValue(_ts8_2.value, 'dateCreated', _ts12_v => assertNumber('dateCreated', _ts12_v));
                if (!_ts8_3.success) { return _ts8_3; }
              

                const _ts8_4 = assertKeyValue(_ts8_3.value, 'dateModified', _ts13_v => assertNumber('dateModified', _ts13_v));
                if (!_ts8_4.success) { return _ts8_4; }
              

                const _ts8_5 = assertKeyValue(_ts8_4.value, 'content', _ts14_v => assertString('content', _ts14_v));
                if (!_ts8_5.success) { return _ts8_5; }
              

                const _ts8_6 = assertKeyValue(_ts8_5.value, 'id', _ts15_v => assertString('id', _ts15_v));
                if (!_ts8_6.success) { return _ts8_6; }
              

          return _ts8_6;
      } else {
        return error('IBlogPost', 'Expected to be object type');
      }
    })();
          },

            'IBlogPostRequest': (value: unknown): Result<IBlogPostRequest> => {
            return references['2'](value);
          },
    };

    type Deserializers = typeof deserializers;

    export const deserialize = <K extends keyof Deserializers>(
      key: K,
      value: unknown
    ): ReturnType<Deserializers[K]> =>
      deserializers[key](value) as ReturnType<Deserializers[K]>;
  
  