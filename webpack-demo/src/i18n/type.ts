/**
 * 递归定义的翻译值类型
 * 可以是字符串或者包含更多嵌套翻译的对象
 */
type TranslationNode =
    | string
    | {
          [key: string]: TranslationNode;
      };

/**
 * 强制至少两层嵌套的翻译对象类型。非i18n必须，但是这样做的目的是方便全局查找。
 * 例如:
 * // user.ts
 * {
 *     auth: {           // 第一层
 *         login: {        // 第二层
 *             title: '登录'  // 更深层级的值
 *         }
 *     }
 * }
 * 全局搜索 auth.login.title 可以快速筛选到所有的翻译值。
 * 但是如果没有这个限制，可能会出现搜出来一堆title的情况。
 */
export type I18nConf = {
    [TopLevel in string]: {
        [SecondLevel in string]: TranslationNode;
    };
};
