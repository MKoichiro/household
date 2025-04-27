// NOTE: 関数を合成する関数
// 現状ミニマムに自作で実装、必要に応じて lodash や ramda が提供しているので移行する
const pipe = <A>(...funcs: Array<(a: A) => A>) => {
  return (initial: A): A => funcs.reduce((acc, func) => func(acc), initial)
}

export default pipe
